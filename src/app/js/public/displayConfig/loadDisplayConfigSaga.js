import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_DISPLAY_CONFIG,
    loadDisplayConfigSuccess,
    loadDisplayConfigError,
} from './reducer';
import { fromDisplayConfig } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadDisplayConfig() {
    const displayConfig = yield select(fromDisplayConfig.hasDisplayConfig);
    if (displayConfig) {
        return;
    }

    const request = yield select(fromUser.getDisplayConfigRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadDisplayConfigError(error.message));
        return;
    }

    yield put(loadDisplayConfigSuccess(response));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_DISPLAY_CONFIG], handleLoadDisplayConfig);
}
