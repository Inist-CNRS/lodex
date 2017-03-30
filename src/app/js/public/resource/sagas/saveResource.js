import { call, put, select, takeLatest } from 'redux-saga/effects';
import isEqual from 'lodash.isequal';

import {
    saveResourceSuccess,
    saveResourceError,
    SAVE_RESOURCE,
} from '../';

import { getSaveResourceRequest, getSaveFieldRequest } from '../../../fetch';
import fetchSaga from '../../../lib/fetchSaga';
import { fromResource } from '../../selectors';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleSaveResource({ payload }) {
    const { position, field, ...resource } = payload;

    if (position !== field.position) {
        const requestFieldPosition = yield select(getSaveFieldRequest, { ...field, position });
        const { error } = yield call(fetchSaga, requestFieldPosition);

        if (error) {
            yield put(saveResourceError(error));
            return;
        }
    }

    const oldResource = yield select(fromResource.getResourceLastVersion);
    if (!isEqual(oldResource, resource)) {
        const request = yield select(getSaveResourceRequest, resource);
        const { error, response } = yield call(fetchSaga, request);

        if (error) {
            yield put(saveResourceError(error));
            return;
        }

        yield put(saveResourceSuccess(response.value));
        return;
    }

    yield put(saveResourceSuccess(resource));
}

export default function* watchSaveResource() {
    yield takeLatest(SAVE_RESOURCE, handleSaveResource);
}
