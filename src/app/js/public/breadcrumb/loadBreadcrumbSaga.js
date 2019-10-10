import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_BREADCRUMB,
    loadBreadcrumbSuccess,
    loadBreadcrumbError,
} from './reducer';
import { fromBreadcrumb } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadBreadcrumb() {
    const breadcrumb = yield select(fromBreadcrumb.hasBreadcrumb);
    if (breadcrumb) {
        return;
    }

    const request = yield select(fromUser.getBreadcrumbRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadBreadcrumbError(error.message));
        return;
    }

    yield put(loadBreadcrumbSuccess(response));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_BREADCRUMB], handleLoadBreadcrumb);
}
