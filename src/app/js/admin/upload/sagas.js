import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fromUser } from '../../sharedSelectors';
import { loadDatasetFile } from '../../lib/loadFile';
import { UPLOAD_FILE, uploadFileError, uploadFileSuccess } from './';
import fetch from '../../lib/fetch';

export function* uploadFile(action) {
    if (!action || !action.payload) {
        return;
    }
    try {
        const clearUploadRequest = yield select(fromUser.getClearUploadRequest);

        const { error } = yield call(fetch, clearUploadRequest);
        if (error) {
            yield put(uploadFileError(error));
            return;
        }
        const token = yield select(fromUser.getToken);
        const { file, cancel } = yield race({
            file: call(loadDatasetFile, action.payload, token),
            cancel: take([LOCATION_CHANGE]),
        });
        if (cancel) {
            return;
        }
        yield put(uploadFileSuccess(file));
    } catch (error) {
        yield put(uploadFileError(error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery([UPLOAD_FILE], uploadFile);
}
