import { call, select, takeEvery } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { CANCEL_UPLOAD } from '../';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleCancelUpload() {
    const request = yield select(fromUser.getCancelUploadRequest);
    yield call(fetchSaga, request);
}

export default function* uploadFileSaga() {
    yield takeEvery(CANCEL_UPLOAD, handleCancelUpload);
}
