import { call, put, select, takeEvery } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { loadDatasetFile } from '../../../lib/loadFile';
import { UPLOAD_FILE, uploadError, uploadSuccess } from '../';
import { preventUnload, allowUnload } from './unload';
import { FINISH_PROGRESS } from '../../progress/reducer';
import { publish as publishAction } from '../../publish';
import { clearPublished } from '../../clear';

// @ts-expect-error TS7006
export function* handleUploadFile(action) {
    if (!action || !action.payload) {
        return;
    }
    try {
        preventUnload();
        // @ts-expect-error TS7057
        const loaderName = yield select(fromUpload.getLoaderName);
        // @ts-expect-error TS7057
        const customLoader = yield select(fromUpload.getCustomLoader);
        // @ts-expect-error TS7057
        const token = yield select(fromUser.getToken);

        yield call(
            loadDatasetFile,
            action.payload,
            token,
            loaderName,
            customLoader,
        );
        allowUnload();
    } catch (error) {
        console.error(error);
        allowUnload();
        yield put(uploadError(error));
    }
}

export function* handleFinishUpload() {
    // @ts-expect-error TS7057
    const isUploadPending = yield select(fromUpload.isUploadPending);
    if (!isUploadPending) {
        return;
    }

    try {
        yield put(uploadSuccess());

        // @ts-expect-error TS7057
        const hasPublishedDataset = yield select(
            // @ts-expect-error TS2339
            fromPublication.hasPublishedDataset,
        );
        if (hasPublishedDataset) {
            yield put(clearPublished());
            yield put(publishAction());
        }
    } catch (error) {
        console.error(error);
        yield put(uploadError(error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery(UPLOAD_FILE, handleUploadFile);
    yield takeEvery(FINISH_PROGRESS, handleFinishUpload);
}
