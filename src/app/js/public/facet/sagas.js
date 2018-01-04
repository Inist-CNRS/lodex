import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    LOAD_FACET_VALUES,
    OPEN_FACET,
    FACET_VALUE_CHANGE,
    FACET_VALUE_SORT,
    loadFacetValuesError,
    loadFacetValuesSuccess,
    clearFacet,
} from './';
import { fromUser } from '../../sharedSelectors';
import { fromFacet } from '../selectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadFacetValuesRequest({ payload: { name } }) {
    const data = yield select(fromFacet.getFacetValueRequestData, name);
    const request = yield select(fromUser.getLoadFacetValuesRequest, {
        field: name,
        ...data,
    });

    const { error, response: values } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFacetValuesError(error));
    }

    return yield put(loadFacetValuesSuccess({ name, values }));
}

export function* clearFacetSaga({ payload: { action } }) {
    if (action === 'POP') {
        return;
    }
    yield put(clearFacet());
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest(
        [OPEN_FACET, LOAD_FACET_VALUES, FACET_VALUE_CHANGE, FACET_VALUE_SORT],
        handleLoadFacetValuesRequest,
    );

    yield takeLatest(LOCATION_CHANGE, clearFacetSaga);
}
