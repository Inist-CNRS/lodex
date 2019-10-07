import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_BREADCRUMB,
    loadBreadcrumbSuccess,
    loadBreadcrumbError,
} from './reducer';
import { fromBreadcrumb } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadMenu() {
    const menu = yield select(fromBreadcrumb.hasMenu);
    if (menu) {
        return;
    }

    const request = yield select(fromUser.getMenuRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadBreadcrumbError(error.message));
        return;
    }

    yield put(loadBreadcrumbSuccess(response));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_BREADCRUMB], handleLoadMenu);
}
