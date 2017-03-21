import { call, put, select, takeLatest } from 'redux-saga/effects';
import { LOCATION_CHANGE, push } from 'react-router-redux';

import {
    ADD_FIELD_TO_RESOURCE_SUCCESS,
    HIDE_RESOURCE_SUCCESS,
    SAVE_RESOURCE_SUCCESS,
    loadResource,
    loadResourceSuccess,
    loadResourceError,
} from '../';
import { loadPublication } from '../../publication';
import { getLoadResourceRequest } from '../../../fetch';
import fetchSaga from '../../../lib/fetchSaga';

import { fromResource } from '../../selectors';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*$)/) || [];

export function* handleLoadResource({ payload }) {
    let isArk;
    let ark;
    let name;
    let uri;

    if (payload && payload.pathname) {
        [, name, isArk, ark] = yield call(parsePathName, payload.pathname);
        if (name !== '/resource') {
            return;
        }
        uri = isArk ? ark : payload.query.uri;
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
    if (response && response.removedAt && ark !== '/removed') {
        yield put(push({ pathname: '/resource/removed', query: { uri } }));
    }
    yield put(loadPublication());
}

export default function* watchLocationChangeToResource() {
    yield takeLatest([
        LOCATION_CHANGE,
        ADD_FIELD_TO_RESOURCE_SUCCESS,
        HIDE_RESOURCE_SUCCESS,
        SAVE_RESOURCE_SUCCESS,
    ], handleLoadResource);
}
