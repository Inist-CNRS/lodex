import {
    fork,
    call,
    put,
    select,
    takeLatest,
    throttle,
} from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import {
    LOAD_DATASET_PAGE,
    PRE_LOAD_DATASET_PAGE,
    APPLY_FILTER,
    SORT_DATASET,
    CHANGE_PAGE,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
    clearFilter,
    facetActionTypes,
    facetActions,
} from './';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromDataset } from '../selectors';
import facetSagasFactory from '../facet/sagas';

export function* handlePreLoadDatasetPage() {
    if (yield select(fromDataset.isDatasetLoaded)) {
        return;
    }

    yield put(loadDatasetPage());
}

export function* handleLoadDatasetPageRequest({ payload }) {
    const facets = yield select(fromDataset.getAppliedFacets);
    const invertedFacets = yield select(fromDataset.getInvertedFacets);
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

    const { data: dataset, total, fullTotal } = response;

    yield put(loadDatasetPageSuccess({ dataset, page, total, fullTotal }));
}

const clearDatasetSearch = function*() {
    const match = yield select(fromDataset.getFilter);

    if (match) {
        yield put(clearFilter());
    }
};

const facetSagas = facetSagasFactory({
    actionTypes: facetActionTypes,
    actions: facetActions,
    selectors: fromDataset,
});

export default function*() {
    yield fork(function*() {
        // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
        yield throttle(
            500,
            [
                LOAD_DATASET_PAGE,
                APPLY_FILTER,
                facetActionTypes.TOGGLE_FACET_VALUE,
                facetActionTypes.CLEAR_FACET,
                facetActionTypes.INVERT_FACET,
                SORT_DATASET,
                CHANGE_PAGE,
            ],
            handleLoadDatasetPageRequest,
        );

        yield takeLatest(PRE_LOAD_DATASET_PAGE, handlePreLoadDatasetPage);
        yield facetSagas();
    });

    yield takeLatest(LOCATION_CHANGE, clearDatasetSearch);
}
