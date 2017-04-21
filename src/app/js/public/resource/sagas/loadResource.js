import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import {
    ADD_FIELD_TO_RESOURCE_SUCCESS,
    HIDE_RESOURCE_SUCCESS,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { loadPublication } from '../../publication';
import { getLoadResourceRequest } from '../../../fetch';
import fetchSaga from '../../../lib/sagas/fetchSaga';

import { fromResource } from '../../selectors';

export const parsePathName = pathname => pathname.match(/^\/((?:ark|uid):\/.*$)/) || [];

export function* handleLoadResource({ payload, type }) {
    let ark;
    let uri;

    if (type === LOCATION_CHANGE) {
        [, ark] = yield call(parsePathName, payload.pathname);

        if (!ark && (!payload.state || !payload.state.uri) && !payload.query.uri) {
            return;
        }
        if (payload && payload.state && payload.state.uri) {
            uri = payload.state.uri;
        } else {
            uri = ark || payload.query.uri;
        }
    } else {
        const resource = yield select(fromResource.getResourceLastVersion);

        if (!resource) {
            return;
        }

        uri = resource.uri;
    }

    yield put(loadResource());
    const request = yield select(getLoadResourceRequest, uri);
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadResourceError(error));
        return;
    }

    yield put(loadResourceSuccess(response));
    yield put(loadPublication());
}

export default function* watchLocationChangeToResource() {
    yield takeLatest([
        LOCATION_CHANGE,
        ADD_FIELD_TO_RESOURCE_SUCCESS,
        HIDE_RESOURCE_SUCCESS,
    ], handleLoadResource);
}
