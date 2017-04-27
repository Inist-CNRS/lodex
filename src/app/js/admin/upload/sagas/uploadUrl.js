import {
    call,
    put,
    select,
    takeEvery,
} from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { UPLOAD_URL, uploadError, uploadSuccess } from '../';
import fetch from '../../../lib/fetch';

export function* handleUploadUrl() {
    const url = yield select(fromUpload.getUrl);
    const request = yield select(fromUser.getUploadUrlRequest, url);
    const { error } = yield call(fetch, request);
    if (error) {
        yield put(uploadError(error));
        return;
    }
    yield put(uploadSuccess());
}

export default function* uploadUrl() {
    yield takeEvery(UPLOAD_URL, handleUploadUrl);
}
