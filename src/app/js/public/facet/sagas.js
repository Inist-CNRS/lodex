import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_FACET_VALUES,
    OPEN_FACET,
    FACET_VALUE_CHANGE,
    loadFacetValuesError,
    loadFacetValuesSuccess,
} from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadFacetValuesRequest({
    payload: { name, filter, currentPage, perPage },
}) {
    const request = yield select(fromUser.getLoadFacetValuesRequest, {
        field: name,
        filter,
        currentPage,
        perPage,
    });

    const { error, response: values } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFacetValuesError(error));
    }

    return yield put(loadFacetValuesSuccess({ name, values }));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest(
        [OPEN_FACET, LOAD_FACET_VALUES, FACET_VALUE_CHANGE],
        handleLoadFacetValuesRequest,
    );
}
