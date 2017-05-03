import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fromUser } from '../../sharedSelectors';
import { IMPORT_FIELDS, importFieldsError, importFieldsSuccess } from './';
import { loadModelFile } from '../../lib/loadFile';

export function* handleLoadModel(action) {
    if (!action || !action.payload) {
        return;
    }
    const token = yield select(fromUser.getToken);
    try {
        const { file, cancel } = yield race({
            file: call(loadModelFile, action.payload, token),
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

export default function* loadModelSaga() {
    yield takeEvery(IMPORT_FIELDS, handleLoadModel);
}
