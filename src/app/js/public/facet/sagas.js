import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_FACET_VALUES,
    OPEN_FACET,
    loadFacetValuesError,
    loadFacetValuesSuccess,
} from './';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadFacetValuesRequest({ payload: { field, filter } }) {
    const request = yield select(fromUser.getLoadFacetValuesRequest, {
        field: field.name,
        filter,
    });

    const { error, response: values } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadFacetValuesError(error));
    }

    return yield put(loadFacetValuesSuccess({ field, values }));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest(
        [OPEN_FACET, LOAD_FACET_VALUES],
        handleLoadFacetValuesRequest,
    );
}
