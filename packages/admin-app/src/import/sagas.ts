import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'redux-first-history';

import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { IMPORT_FIELDS, importFieldsError, importFieldsSuccess } from './index';
import { loadModelFile } from '@lodex/frontend-common/utils/loadFile';

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

        const { hasEnrichments, hasPrecomputed, themeNotFound } =
            JSON.parse(loadModelFileStatus);
        yield put(
            importFieldsSuccess({
                hasEnrichments,
                hasPrecomputed,
                themeNotFound,
            }),
        );
    } catch (error) {
        yield put(importFieldsError(error));
    }
}

export default function* loadModelSaga() {
    yield takeEvery(IMPORT_FIELDS, handleLoadModel);
}
