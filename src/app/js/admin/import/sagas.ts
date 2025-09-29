import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'redux-first-history';

import { fromUser } from '../../sharedSelectors';
import {
    IMPORT_FIELDS,
    importFieldsError,
    importFieldsSuccess,
    importFieldsClosed,
} from './';
import { loadModelFile } from '../../lib/loadFile';

// @ts-expect-error TS7006
export function* handleLoadModel(action) {
    if (!action || !action.payload) {
        return;
    }
    // @ts-expect-error TS7057
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
                hasPrecomputed: JSON.parse(loadModelFileStatus).hasPrecomputed,
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
