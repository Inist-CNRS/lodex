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
    if (!action || !action.payload) {
        return;
    }
    try {
        preventUnload();
        const loaderName = yield select(fromUpload.getLoaderName);
        const customLoader = yield select(fromUpload.getCustomLoader);
        const token = yield select(fromUser.getToken);
        yield call(
            loadDatasetFile,
            action.payload,
            token,
            loaderName,
            customLoader,
        );

        allowUnload();
        yield take(FINISH_PROGRESS);

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
        allowUnload();
        yield put(uploadError(error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery(UPLOAD_FILE, handleUploadFile);
}
