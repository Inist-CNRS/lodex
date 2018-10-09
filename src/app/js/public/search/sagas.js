import { put, select, call, takeEvery } from 'redux-saga/effects';

import { SEARCH, searchSucceed, searchFailed } from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

const OVERVIEW_TITLE = 1;
const OVERVIEW_DESCRIPTION = 2;

let overviewFields;

const getOverviewFields = function*() {
    if (overviewFields) {
        return overviewFields;
    }

    const request = yield select(fromUser.getLoadFieldRequest);
    const { response: fields } = yield call(fetchSaga, request);

    overviewFields = fields.reduce((acc, field) => {
        if (field.label === 'uri') {
            acc.uri = field.name;
        }

        if (typeof field.overview === 'undefined') {
            return acc;
        }

        if (field.overview === OVERVIEW_TITLE) {
            acc.title = field.name;
        }

        if (field.overview === OVERVIEW_DESCRIPTION) {
            acc.description = field.name;
        }

        return acc;
    }, {});

    return overviewFields;
};

const datasetToOverview = dataset => {
    if (!dataset || !overviewFields) {
        return null;
    }

    return Object.entries(overviewFields).reduce((acc, [key, name]) => {
        acc[key] = dataset[name];
        return acc;
    }, {});
};

const handleSearch = function*({ payload }) {
    yield call(getOverviewFields);

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: payload ? payload.query : '',
        page: 1,
        perPage: 10,
    });

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(searchFailed({ error }));
        return;
    }

    yield put(searchSucceed({ dataset: response.data.map(datasetToOverview) }));
};

export default function*() {
    yield takeEvery(SEARCH, handleSearch);
}
