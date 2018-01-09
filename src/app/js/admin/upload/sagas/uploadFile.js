import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload, fromPublication } from '../../selectors';
import { loadDatasetFile } from '../../../lib/loadFile';
import { UPLOAD_FILE, uploadError, uploadSuccess } from '../';
import fetch from '../../../lib/fetch';

export function* handleUploadFile(action) {
    if (!action || !action.payload) {
        return;
    }
    try {
        const isPublished = yield select(fromPublication.hasPublishedDataset);
        if (!isPublished) {
            const clearUploadRequest = yield select(
                fromUser.getClearUploadRequest,
            );

            const { error } = yield call(fetch, clearUploadRequest);
            if (error) {
                yield put(uploadError(error));
                return;
            }
        }
        const parserName = yield select(fromUpload.getParserName);
        const token = yield select(fromUser.getToken);
        const { file, cancel } = yield race({
            file: call(loadDatasetFile, action.payload, token, parserName),
            cancel: take([LOCATION_CHANGE]),
        });
        if (cancel) {
            return;
        }
        yield put(uploadSuccess(file));
    } catch (error) {
        yield put(uploadError(error));
    }
}

export default function* uploadFileSaga() {
    yield takeEvery(UPLOAD_FILE, handleUploadFile);
}
