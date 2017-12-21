import { call, put, select, takeEvery, throttle } from 'redux-saga/effects';

import {
    PRE_LOAD_CHART_DATA,
    LOAD_CHART_DATA,
    loadChartData,
    loadChartDataSuccess,
    loadChartDataError,
} from './';
import getQueryString from '../../lib/getQueryString';
import fetchSaga from '../../lib/sagas/fetchSaga';
import {
    fromGraph,
    fromCharacteristic,
    fromDataset,
    fromFacet,
    fromRouting,
} from '../selectors';
import { fromFields } from '../../sharedSelectors';
import { TOGGLE_FACET_VALUE, CLEAR_FACET, INVERT_FACET } from '../facet';
import { APPLY_FILTER } from '../dataset';
import { CONFIGURE_FIELD_SUCCESS } from '../../fields';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../characteristic';

export function* handlePreLoadChartData({ payload: { field, value } }) {
    if (yield select(fromGraph.isChartDataLoaded, field.name)) {
        return;
    }

    yield put(loadChartData({ field, value }));
}

export function* handleLoadChartDataRequest({ payload: { field } = {} }) {
    const name =
        (field && field.name) || (yield select(fromRouting.getGraphName));

    if (!name) {
        return;
    }
    const value = yield select(
        fromCharacteristic.getCharacteristicByName,
        name,
    );
    const params = yield select(fromFields.getGraphFieldParamsByName, name);

    const facets = yield select(fromFacet.getAppliedFacets);
    const invertedFacets = yield select(fromFacet.getInvertedFacets);
    const match = yield select(fromDataset.getFilter);

    const queryString = yield call(getQueryString, {
        facets,
        invertedFacets,
        match,
        params,
    });

    const { error, response } = yield call(fetchSaga, {
        url: `${value}?${queryString}`,
    });

    if (error) {
        yield put(loadChartDataError({ name, error }));
        return;
    }
    if (response.data) {
        yield put(loadChartDataSuccess({ name, data: response.data }));
        return;
    }
    if (response.aggregations) {
        const firstKey = Object.keys(response.aggregations).shift();
        const data = response.aggregations[firstKey].buckets.map(item => ({
            name: item.keyAsString || item.key,
            value: item.docCount,
        }));
        yield put(loadChartDataSuccess({ name, data }));
        return;
    }
    yield put(loadChartDataSuccess({ name, data: 'no result' }));
}

export default function*() {
    // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
    yield throttle(
        500,
        [
            LOAD_CHART_DATA,
            TOGGLE_FACET_VALUE,
            CLEAR_FACET,
            APPLY_FILTER,
            INVERT_FACET,
            CONFIGURE_FIELD_SUCCESS,
            UPDATE_CHARACTERISTICS_SUCCESS,
        ],
        handleLoadChartDataRequest,
    );
    yield takeEvery(LOAD_CHART_DATA, handleLoadChartDataRequest);
    yield takeEvery(PRE_LOAD_CHART_DATA, handlePreLoadChartData);
}
