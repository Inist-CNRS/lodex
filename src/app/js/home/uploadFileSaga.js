import { takeEvery } from 'redux-saga';
import { call, race, take, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import loadFile from '../lib/loadFile';
import { UPLOAD_FILE, uploadFilePending, uploadFileError, uploadFileSuccess } from './homeActions';

export function* uploadFile(action) {
    if (!action.payload) {
        return;
    }
    yield put(uploadFilePending());
    const { file, cancel } = yield race({
        file: call(loadFile, action.payload),
        cancel: take([LOCATION_CHANGE]),
    });
    if (cancel) {
        return;
    }

    yield put(uploadFileSuccess(file));
}

export default function* uploadFileSaga() {
    yield takeEvery([UPLOAD_FILE], uploadFile);
}
