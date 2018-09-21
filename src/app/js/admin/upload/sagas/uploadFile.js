import { call, race, take, put, select, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';

import { fromUser } from '../../../sharedSelectors';
import { fromUpload } from '../../selectors';
import { loadDatasetFile } from '../../../lib/loadFile';
import { UPLOAD_FILE, uploadError, uploadSuccess } from '../';

export function* handleUploadFile(action) {
    if (!action || !action.payload) {
        return;
    }
    try {
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
