import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    createResourceSuccess,
    createResourceError,
    getNewResourceFormData,
    CREATE_RESOURCE,
} from '../';

import { getCreateResourceRequest } from '../../../fetch';
import fetchSaga from '../../../lib/fetchSaga';

export function* handleCreateResource() {
    const resource = yield select(getNewResourceFormData);
    const request = yield select(getCreateResourceRequest, resource);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(createResourceError(error));
        return;
    }

    yield put(createResourceSuccess(response.value));
}

export default function* watchSaveResource() {
    yield takeLatest(CREATE_RESOURCE, handleCreateResource);
}
