import { fork, call, put, select, takeLatest } from 'redux-saga/effects';
import { delay } from 'redux-saga';

import {
    PRE_LOAD_CHART_DATA,
    LOAD_CHART_DATA,
    loadChartData,
    loadChartDataSuccess,
    loadChartDataError,
} from './';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromGraph, fromDataset, fromFacet } from '../selectors';

export function* handlePreLoadChartData({ name }) {
    if (yield select(fromGraph.isChartDataLoaded, name)) {
        return;
    }

    yield put(loadChartData({ name }));
}

export function* handleLoadChartDataRequest({ name }) {
    const facets = yield select(fromFacet.getAppliedFacets);
    const invertedFacets = yield select(fromFacet.getInvertedFacets);
    const match = yield select(fromDataset.getFilter);

    const request = yield select(fromUser.getLoadDatasetPageRequest, {
        match,
        facets,
        invertedFacets,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadChartDataError(error));
        return;
    }

    yield put(loadChartDataSuccess({ name, response }));

    yield delay(500);
}

export default function*() {
    yield fork(function*() {
        yield takeLatest(LOAD_CHART_DATA, handleLoadChartDataRequest);
    });
    yield fork(function*() {
        yield takeLatest(PRE_LOAD_CHART_DATA, handlePreLoadChartData);
    });
}
