import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fromUser } from '../../sharedSelectors';
import {
    IMPORT_FIELDS,
    importFieldsError,
    importFieldsSuccess,
    importFieldsClosed,
} from './';
import { loadModelFile } from '../../lib/loadFile';

export function* handleLoadModel(action) {
    if (!action || !action.payload) {
        return;
    }
    const token = yield select(fromUser.getToken);
    try {
        const { loadModelFileStatus, cancel } = yield race({
            loadModelFileStatus: call(loadModelFile, action.payload, token),
            cancel: take([LOCATION_CHANGE]),
        });
        if (cancel) {
            return;
        }

        yield put(
            importFieldsSuccess({
                hasEnrichments: JSON.parse(loadModelFileStatus).hasEnrichments,
            }),
        );
        yield put(importFieldsClosed());
    } catch (error) {
        yield put(importFieldsError(error));
        yield put(importFieldsClosed());
    }
}

export default function* loadModelSaga() {
    yield takeEvery(IMPORT_FIELDS, handleLoadModel);
}
