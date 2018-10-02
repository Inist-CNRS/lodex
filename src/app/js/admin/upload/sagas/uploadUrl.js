import { call, put, select, takeEvery } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { UPLOAD_URL, uploadError, uploadSuccess } from '../';
import fetch from '../../../lib/fetch';
import { preventUnload, allowUnload } from './unload';

export function* handleUploadUrl() {
    preventUnload();
    const url = yield select(fromUpload.getUrl);
    const parserName = yield select(fromUpload.getParserName);
    const request = yield select(fromUser.getUploadUrlRequest, {
        url,
        parserName,
    });
    const { error } = yield call(fetch, request);

    allowUnload();
    if (error) {
        yield put(uploadError(error));
        return;
    }
    yield put(uploadSuccess());
}

export default function* uploadUrl() {
    yield takeEvery(UPLOAD_URL, handleUploadUrl);
}
