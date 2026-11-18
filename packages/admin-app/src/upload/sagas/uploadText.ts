import { call, put, select, takeEvery } from 'redux-saga/effects';

import { allowUnload, preventUnload } from './unload';
import { rememberManualImportDismissal } from '../../siteWizard/wizardDismissal';
import { fromUpload } from '../../selectors';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetch from '@lodex/frontend-common/fetch/fetch';
import { UPLOAD_TEXT, uploadError } from '../index';

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
    // its import is queued (see rememberManualImportDismissal)
    yield call(rememberManualImportDismissal);
    // Success is dispatched by handleFinishUpload once the import job is done
}

export default function* uploadText() {
    yield takeEvery(UPLOAD_TEXT, handleUploadText);
}
