import { call, put, select, takeEvery } from 'redux-saga/effects';

import { allowUnload, preventUnload } from './unload';
import { fromUpload } from '../../selectors';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import fetch from '../../../../../src/app/js/lib/fetch';
import { UPLOAD_TEXT, uploadError, uploadSuccess } from '../index';

export function* handleUploadText() {
    preventUnload();
    // @ts-expect-error TS7057
    const text = yield select(fromUpload.getTextContent);
    // @ts-expect-error TS7057
    const loaderName = yield select(fromUpload.getLoaderName);
    // @ts-expect-error TS7057
    const customLoader = yield select(fromUpload.getCustomLoader);
    // @ts-expect-error TS7057
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
