import {
    call,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { UPLOAD_URL, uploadError, uploadSuccess } from '../';
import fetch from '../../../lib/fetch';

export function* handleUploadUrl({ payload: url }) {
    const request = yield select(fromUser.getUploadUrlRequest, url);
    const { error, response } = yield call(fetch, request);

    if (error) {
        yield put(uploadError(error));
        return;
    }
    yield put(uploadSuccess(response));
}

export default function* uploadUrl() {
    yield takeEvery(UPLOAD_URL, handleUploadUrl);
}
