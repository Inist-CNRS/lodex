import { call, put, select, takeEvery, throttle } from 'redux-saga/effects';

import {
    PRE_LOAD_FORMAT_DATA,
    LOAD_FORMAT_DATA,
    loadFormatData,
    loadFormatDataSuccess,
    loadFormatDataError,
} from './reducer';
import getQueryString from '../lib/getQueryString';
import fetchSaga from '../lib/sagas/fetchSaga';
import {
    fromFormat,
    fromCharacteristic,
    fromDataset,
    fromFacet,
    fromRouting,
} from '../public/selectors';
import { fromFields, fromUser } from '../sharedSelectors';
import { TOGGLE_FACET_VALUE, CLEAR_FACET, INVERT_FACET } from '../public/facet';
import { APPLY_FILTER } from '../public/dataset';
import { CONFIGURE_FIELD_SUCCESS } from '../fields';
import { UPDATE_CHARACTERISTICS_SUCCESS } from '../public/characteristic';

export function* handlePreLoadFormatData({ payload: { field, value } }) {
    if (yield select(fromFormat.isFormatDataLoaded, field.name)) {
        return;
    }

    yield put(loadFormatData({ field, value }));
}

export function* handleLoadFormatDataRequest({
    payload: { field, filter } = {},
}) {
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
        params: {
            ...params,
            ...(filter || {}),
        },
    });

    const request = yield select(fromUser.getUrlRequest, {
        url: value,
        queryString,
    });

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadFormatDataError({ name, error }));
        return;
    }
    if (response.data) {
        yield put(loadFormatDataSuccess({ name, data: response.data }));
        return;
    }
    yield put(loadFormatDataSuccess({ name, data: response }));
}

export default function*() {
    // see https://github.com/redux-saga/redux-saga/blob/master/docs/api/README.md#throttlems-pattern-saga-args
    yield throttle(
        500,
        [
            TOGGLE_FACET_VALUE,
            CLEAR_FACET,
            APPLY_FILTER,
            INVERT_FACET,
            CONFIGURE_FIELD_SUCCESS,
            UPDATE_CHARACTERISTICS_SUCCESS,
        ],
        handleLoadFormatDataRequest,
    );
    yield takeEvery(LOAD_FORMAT_DATA, handleLoadFormatDataRequest);
    yield takeEvery(PRE_LOAD_FORMAT_DATA, handlePreLoadFormatData);
}
