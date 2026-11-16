import { call, put, select, take, takeEvery } from 'redux-saga/effects';

import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { loadDatasetFile } from '@lodex/frontend-common/utils/loadFile';
import {
    IMPORT_FINISHED,
    UPLOAD_FILE,
    importFinished,
    uploadError,
    uploadSuccess,
} from '../index';
import { preventUnload, allowUnload } from './unload';
import { publish as publishAction } from '../../publish';
import { clearPublished } from '../../clear';
import {
    LOAD_PARSING_RESULT_ERROR,
    LOAD_PARSING_RESULT_SUCCESS,
} from '../../parsing';

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
        yield put(uploadError(error as Error));
    }
}

export function* handleFinishUpload({
    payload,
}: ReturnType<typeof importFinished>) {
    // @ts-expect-error TS7057
    const isUploadPending = yield select(fromUpload.isUploadPending);
    if (!isUploadPending) {
        return;
    }

    if (!payload.success) {
        // JobProgress already notifies the error or the cancellation
        yield put(uploadError(new Error(payload.message || 'import_error')));
        return;
    }

    try {
        // JobProgress reloads the parsing result: keep the upload pending until
        // it is loaded, otherwise the empty upload form shows again in between.
        yield take([LOAD_PARSING_RESULT_SUCCESS, LOAD_PARSING_RESULT_ERROR]);
        yield put(uploadSuccess());

        // @ts-expect-error TS7057
        const hasPublishedDataset = yield select(
            fromPublication.hasPublishedDataset,
        );
        if (hasPublishedDataset) {
            yield put(clearPublished());
            yield put(publishAction());
        }
    } catch (error) {
        console.error(error);
        yield put(uploadError(error as Error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery(UPLOAD_FILE, handleUploadFile);
    yield takeEvery(IMPORT_FINISHED, handleFinishUpload);
}
