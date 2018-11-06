import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { facetActionTypes, facetActions } from '../dataset';
import { fromUser } from '../../sharedSelectors';
import { fromDataset } from '../selectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import scrollToTop from '../../lib/scrollToTop';

const {
    LOAD_FACET_VALUES,
    OPEN_FACET,
    FACET_VALUE_CHANGE,
    FACET_VALUE_SORT,
    TOGGLE_FACET_VALUE,
} = facetActionTypes;

const {
    loadFacetValuesError,
    loadFacetValuesSuccess,
    clearFacet,
} = facetActions;

export function* handleLoadFacetValuesRequest({ payload: { name } }) {
    const data = yield select(fromDataset.getFacetValueRequestData, name);
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

export function* clearFacetSaga() {
    const appliedFacets = yield select(fromDataset.getAppliedFacets);

    if (Object.keys(appliedFacets).length > 0) {
        yield put(clearFacet());
    }
}

export function* scrollToTopSaga() {
    yield call(scrollToTop, true);
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest(
        [OPEN_FACET, LOAD_FACET_VALUES, FACET_VALUE_CHANGE, FACET_VALUE_SORT],
        handleLoadFacetValuesRequest,
    );

    yield takeLatest(TOGGLE_FACET_VALUE, scrollToTopSaga);

    yield takeLatest(LOCATION_CHANGE, clearFacetSaga);
}
