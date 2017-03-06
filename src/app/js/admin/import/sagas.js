import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { getToken } from '../../user';
import { IMPORT_FIELDS, importFieldsError, importFieldsSuccess } from './';

export const upload = (file, token) =>
new Promise((resolve, reject) => {
    const oReq = new XMLHttpRequest();
    oReq.open('POST', '/api/field/import', true);
    oReq.withCredentials = true;
    oReq.setRequestHeader('Authorization', `Bearer ${token}`);
    oReq.onload = (event) => {
        if (event.currentTarget.status !== 200) {
            reject(new Error(event.currentTarget.responseText));
            return;
        }
        resolve();
    };
    oReq.onerror = reject;

    oReq.send(file);
});

export function* uploadFile(action) {
    if (!action || !action.payload) {
        return;
    }
    const token = yield select(getToken);
    try {
        const { file, cancel } = yield race({
            file: call(upload, action.payload, token),
            cancel: take([LOCATION_CHANGE]),
        });
        if (cancel) {
            return;
        }
        yield put(importFieldsSuccess(file));
    } catch (error) {
        yield put(importFieldsError(error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery([IMPORT_FIELDS], uploadFile);
}
