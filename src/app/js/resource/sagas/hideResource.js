import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { push } from 'react-router-redux';

import {
    hideResourceSuccess,
    hideResourceError,
    getHideResourceFormData,
    HIDE_RESOURCE,
} from '../';
import { getHideResourceRequest } from '../../fetch';
import fetchSaga from '../../lib/fetchSaga';

export const parsePathName = pathname => pathname.match(/^(\/resource)(\/ark:\/)?(.*?$)/) || [];

export function* handleHideResource({ payload: uri }) {
    const { reason } = yield select(getHideResourceFormData);
    const request = yield select(getHideResourceRequest, {
        uri,
        reason,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(hideResourceError(error));
        return;
    }

    yield put(hideResourceSuccess(response));
    yield put(push({ pathname: '/resource/removed', query: { uri } }));
}

export default function* watchHideResource() {
    yield takeLatest(HIDE_RESOURCE, handleHideResource);
}
