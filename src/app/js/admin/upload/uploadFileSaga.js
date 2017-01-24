import { takeEvery } from 'redux-saga';
import { call, race, take, put, select } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { getToken } from '../../user';
import loadFile from '../../lib/loadFile';
import { UPLOAD_FILE, uploadFilePending, uploadFileError, uploadFileSuccess } from './';

export function* uploadFile(action) {
    if (!action.payload) {
        return;
    }
    yield put(uploadFilePending());
    const token = yield select(getToken);
    try {
        const { file, cancel } = yield race({
            file: call(loadFile, action.payload, token),
            cancel: take([LOCATION_CHANGE]),
        });
        console.log({ file });
        if (cancel) {
            return;
        }
        yield put(uploadFileSuccess(file));
    } catch (error) {
        yield put(uploadFileError(error.message));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery([UPLOAD_FILE], uploadFile);
}
