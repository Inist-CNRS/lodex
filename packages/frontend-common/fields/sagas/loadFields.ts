import { call, put, select, takeLatest } from 'redux-saga/effects';

import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import {
    LOAD_FIELD,
    loadFieldError,
    loadFieldSuccess,
} from '@lodex/frontend-common/fields/reducer';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { IMPORT_FIELDS_SUCCESS } from '../../../admin-app/src/import';
import { UPLOAD_SUCCESS } from '../../../admin-app/src/upload';

export function* handleLoadField() {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadFieldRequest);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadFieldError(error));
    }
    // @ts-expect-error TS7057
    return yield put(loadFieldSuccess(response));
}

export default function* watchLoadField() {
    yield takeLatest(
        [LOAD_FIELD, IMPORT_FIELDS_SUCCESS, UPLOAD_SUCCESS],
        handleLoadField,
    );
}
