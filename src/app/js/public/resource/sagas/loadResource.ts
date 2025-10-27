import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    HIDE_RESOURCE_SUCCESS,
    PRE_LOAD_RESOURCE,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { preLoadPublication } from '../../../fields';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromResource, fromRouter } from '../../selectors';

// @ts-expect-error TS7006
export const parsePathName = (pathname) => {
    const match = pathname.match(/^\/((?:ark|uid):\/.*$)/);

    return match && match[1];
};

export function* handleLoadResource(forceReload: boolean) {
    yield put(preLoadPublication());
    // @ts-expect-error TS7057
    const uri = yield select(fromRouter.getResourceUri);
    if (!uri) {
        return;
    }

    // @ts-expect-error TS7057
    if (yield select(fromResource.isResourceLoaded, uri) && !forceReload) {
        return;
    }

    yield put(loadResource());
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadResourceRequest, uri);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadResourceError(error));
        return;
    }

    yield put(loadResourceSuccess(response));
}

export function* handleForceLoadResource() {
    yield handleLoadResource(true);
}

export function* handleReloadResource() {
    yield handleLoadResource(false);
}

export default function* watchLocationChangeToResource() {
    yield takeLatest([PRE_LOAD_RESOURCE], handleReloadResource);
    yield takeLatest([HIDE_RESOURCE_SUCCESS], handleForceLoadResource);
}
