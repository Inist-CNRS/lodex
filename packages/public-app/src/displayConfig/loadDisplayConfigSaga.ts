import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_DISPLAY_CONFIG,
    loadDisplayConfigSuccess,
    loadDisplayConfigError,
} from './reducer';
import { fromDisplayConfig } from '../selectors';
import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

export function* handleLoadDisplayConfig() {
    // @ts-expect-error TS7057
    const displayConfig = yield select(fromDisplayConfig.hasDisplayConfig);
    if (displayConfig) {
        return;
    }

    // @ts-expect-error TS7057
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
