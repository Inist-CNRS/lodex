import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_BREADCRUMB,
    loadBreadcrumbSuccess,
    loadBreadcrumbError,
} from './reducer';
import { fromBreadcrumb } from '../selectors';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

export function* handleLoadBreadcrumb() {
    // @ts-expect-error TS7057
    const breadcrumb = yield select(fromBreadcrumb.hasBreadcrumb);
    if (breadcrumb) {
        return;
    }

    // @ts-expect-error TS7057
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
