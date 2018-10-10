import { take, put, select, call, takeEvery } from 'redux-saga/effects';

import { SEARCH, searchSucceed, searchFailed } from './';
import { LOAD_PUBLICATION_SUCCESS } from '../../fields';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

const handleSearch = function*({ payload }) {
    const fieldsNumber = yield select(fromFields.getNbColumns);

    if (fieldsNumber === 0) {
        // Fields aren't loaded yet. Wait for them.
        yield take(LOAD_PUBLICATION_SUCCESS);
    }

    const fields = {
        uri: 'uri',
        title: yield select(fromFields.getResourceTitleFieldName),
        description: yield select(fromFields.getResourceDescriptionFieldName),
    };

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match: payload ? payload.query : '',
        perPage: 10,
    });

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(searchFailed({ error }));
        return;
    }

    yield put(searchSucceed({ dataset: response.data, fields }));
};

export default function*() {
    yield takeEvery(SEARCH, handleSearch);
}
