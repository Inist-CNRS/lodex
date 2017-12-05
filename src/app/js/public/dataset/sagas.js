import { fork, call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    LOAD_DATASET_PAGE,
    PRE_LOAD_DATASET_PAGE,
    APPLY_FILTER,
    SORT_DATASET,
    CHANGE_PAGE,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';

import { TOGGLE_FACET_VALUE, CLEAR_FACET, INVERT_FACET } from '../facet';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromDataset, fromFacet } from '../selectors';

export function* handlePreLoadDatasetPage() {
    if (yield select(fromDataset.isDatasetLoaded)) {
        return;
    }

    yield put(loadDatasetPage());
}

export function* handleLoadDatasetPageRequest({ payload }) {
    const facets = yield select(fromFacet.getAppliedFacets);
    const invertedFacets = yield select(fromFacet.getInvertedFacets);
    const match = yield select(fromDataset.getFilter);
    const sort = yield select(fromDataset.getSort);

    let page = payload && payload.page;
    let perPage = payload && payload.perPage;

    if (page === false || typeof page === 'undefined') {
        page = yield select(fromDataset.getDatasetCurrentPage);
    }

    if (!perPage) {
        perPage = yield select(fromDataset.getDatasetPerPage);
    }

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match,
        facets,
        invertedFacets,
        sort,
        page,
        perPage,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadDatasetPageError(error));
        return;
    }

    const { data: dataset, total } = response;

    yield put(loadDatasetPageSuccess({ dataset, page, total }));

    yield delay(500);
}

export default function*() {
    yield fork(function*() {
        yield takeLatest(
            [
                LOAD_DATASET_PAGE,
                APPLY_FILTER,
                TOGGLE_FACET_VALUE,
                CLEAR_FACET,
                INVERT_FACET,
                SORT_DATASET,
                CHANGE_PAGE,
            ],
            handleLoadDatasetPageRequest,
        );
    });
    yield fork(function*() {
        yield takeLatest(PRE_LOAD_DATASET_PAGE, handlePreLoadDatasetPage);
    });
}
