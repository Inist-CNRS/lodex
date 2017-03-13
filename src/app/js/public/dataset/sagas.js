import { call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    LOAD_DATASET_PAGE,
    APPLY_FILTER,
    SORT_DATASET,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';

import { APPLY_FACET, REMOVE_FACET } from '../facet';
import { getLoadDatasetPageRequest } from '../../fetch/';
import fetchSaga from '../../lib/fetchSaga';
import { fromDataset, fromFacet } from '../selectors';

export function* handleLoadDatasetPageRequest() {
    const facets = yield select(fromFacet.getAppliedFacets);
    const match = yield select(fromDataset.getFilter);
    const page = yield select(fromDataset.getDatasetCurrentPage);
    const perPage = yield select(fromDataset.getDatasetPerPage);
    const sort = yield select(fromDataset.getSort);

    const params = facets.reduce((acc, facet) => ({
        ...acc,
        [facet.field.name]: facet.value,
    }), {
        page,
        perPage,
        ...sort,
    });

    if (match) {
        params.match = match;
    }

    const request = yield select(getLoadDatasetPageRequest, params);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadDatasetPageError(error));
        return;
    }

    const { data: dataset, total } = response;

    yield put(loadDatasetPageSuccess({ dataset, page, total }));

    yield delay(500);
}

export default function* () {
    yield takeLatest([
        LOAD_DATASET_PAGE,
        APPLY_FILTER,
        APPLY_FACET,
        REMOVE_FACET,
        SORT_DATASET,
    ], handleLoadDatasetPageRequest);
}
