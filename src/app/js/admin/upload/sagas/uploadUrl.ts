import { call, put, select, takeEvery } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { UPLOAD_URL, uploadError, uploadSuccess } from '../';
import fetch from '../../../lib/fetch';
import { preventUnload, allowUnload } from './unload';

export function* handleUploadUrl() {
    preventUnload();
    // @ts-expect-error TS7057
    const url = yield select(fromUpload.getUrl);
    // @ts-expect-error TS7057
    const loaderName = yield select(fromUpload.getLoaderName);
    // @ts-expect-error TS7057
    const customLoader = yield select(fromUpload.getCustomLoader);
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getUploadUrlRequest, {
        url,
        loaderName,
        customLoader,
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
