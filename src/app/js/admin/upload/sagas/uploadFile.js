import { call, take, put, select, takeEvery } from 'redux-saga/effects';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { loadDatasetFile } from '../../../lib/loadFile';
import { UPLOAD_FILE, uploadError, uploadSuccess } from '../';
import { preventUnload, allowUnload } from './unload';
import { FINISH_PROGRESS } from '../../progress/reducer';
import { publish as publishAction } from '../../publish';
import { clearPublished } from '../../clear';

export function* handleUploadFile(action) {
    console.log('HELLLO HANDLE UPLOADs');
    if (!action || !action.payload) {
        return;
    }
    try {
        preventUnload();
        console.log('HANDLE STEP ONE');
        const loaderName = yield select(fromUpload.getLoaderName);
        const customLoader = yield select(fromUpload.getCustomLoader);
        const token = yield select(fromUser.getToken);
        console.log('HANDLE STEP two');
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
    console.log('HANDLE FINISH UPLOAAAAAAD')
    const isUploadPending = yield select(fromUpload.isUploadPending);
    if (!isUploadPending) {
        console.log('IUPLOAD IS NOT PENDING')
        return;
    }

    console.log('UPLOAD IS PENDING')

    try {
        yield put(uploadSuccess());

        const hasPublishedDataset = yield select(
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
