import { call, put, select, takeEvery } from 'redux-saga/effects';

import { allowUnload, preventUnload } from './unload';
import { fromUpload } from '../../selectors';
import { fromUser } from '../../../sharedSelectors';
import fetch from '../../../lib/fetch';
import { UPLOAD_TEXT, uploadError, uploadSuccess } from '../index';

export function* handleUploadText() {
    preventUnload();
    const text = yield select(fromUpload.getTextContent);
    const loaderName = yield select(fromUpload.getLoaderName);
    const customLoader = yield select(fromUpload.getCustomLoader);
    const request = yield select(fromUser.getUploadTextRequest, {
        text,
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

export default function* uploadText() {
    yield takeEvery(UPLOAD_TEXT, handleUploadText);
}
