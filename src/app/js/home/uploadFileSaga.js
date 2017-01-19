import { takeEvery } from 'redux-saga';
import { call, race, take, put } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import loadFile from '../lib/loadFile';
import { UPLOAD_FILE, uploadFilePending, uploadFileError, uploadFileSuccess } from './homeActions';
import fetchSaga from '../lib/fetchSaga';

export function* uploadFile(action) {
    const { file, cancel } = yield race({
        file: call(loadFile, action.payload),
        cancel: take([LOCATION_CHANGE]),
    });
    if (cancel) {
        return;
    }

    yield put(uploadFilePending());
    const { result, error } = yield call(fetchSaga, {
        url: 'http://localhost:3000/upload',
        config: {
            credentials: 'include',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: {
                file,
            },
        },
    });
    if (error) {
        yield put(uploadFileError(error));
        return;
    }

    yield put(uploadFileSuccess());
}

export default function* uploadFileSaga() {
    yield takeEvery([UPLOAD_FILE], uploadFile);
}
