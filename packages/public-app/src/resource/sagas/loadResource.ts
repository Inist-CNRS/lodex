import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    HIDE_RESOURCE_SUCCESS,
    PRE_LOAD_RESOURCE,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../index';
import { preLoadPublication } from '../../../../../src/app/js/fields/reducer';
import { fromUser } from '../../../../../src/app/js/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
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
    if ((yield select(fromResource.isResourceLoaded, uri)) && !forceReload) {
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

export function* handleForceLoadResource(_action: unknown) {
    yield* handleLoadResource(true);
}

export function* handlePreloadResource(_action: unknown) {
    yield* handleLoadResource(false);
}

export default function* watchLocationChangeToResource() {
    yield takeLatest([PRE_LOAD_RESOURCE], handlePreloadResource);
    yield takeLatest([HIDE_RESOURCE_SUCCESS], handleForceLoadResource);
}
