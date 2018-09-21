import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import qs from 'qs';

import {
    HIDE_RESOURCE_SUCCESS,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { preLoadPublication } from '../../../fields';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

import { fromResource } from '../../selectors';

export const getUriFromQueryString = queryString =>
    qs.parse(queryString, { ignoreQueryPrefix: true }).uri;

export const parsePathName = pathname => {
    const match = pathname.match(/^\/((?:ark|uid):\/.*$)/);

    return match && match[1];
};

export const getUriFromPayload = payload => {
    const ark = parsePathName(payload.location.pathname);
    if (ark) {
        return ark;
    }

    if (
        payload &&
        payload.location &&
        payload.location.state &&
        payload.location.state.uri
    ) {
        return payload.location.state.uri;
    }

    return getUriFromQueryString(payload.location.search);
};

export function* getUri(type, payload) {
    if (type === LOCATION_CHANGE) {
        return yield call(getUriFromPayload, payload);
    }
    const resource = yield select(fromResource.getResourceLastVersion);

    if (!resource) {
        return null;
    }

    return resource.uri;
}

export function* handleLoadResource({ payload, type }) {
    if (type === LOCATION_CHANGE && payload.location.pathname === '/login') {
        return;
    }
    yield put(preLoadPublication());
    const uri = yield call(getUri, type, payload);

    if (!uri) {
        return;
    }

    if (yield select(fromResource.isResourceLoaded, uri)) {
        return;
    }

    yield put(loadResource());
    const request = yield select(fromUser.getLoadResourceRequest, uri);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadResourceError(error));
        return;
    }

    yield put(loadResourceSuccess(response));
}

export default function* watchLocationChangeToResource() {
    yield takeLatest(
        [LOCATION_CHANGE, HIDE_RESOURCE_SUCCESS],
        handleLoadResource,
    );
}
