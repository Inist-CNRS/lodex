import { call, put, race, select, take } from 'redux-saga/effects';
import { replace } from 'react-router-redux';
import fetch from './fetch';
import { getCurrentLocation } from '../reducers';

export default function* fetchSaga(request, interruptingActions = []) {
    const {
        fetchResult,
        cancel,
    } = yield race({
        fetchResult: call(fetch, request),
        cancel: take([].concat(interruptingActions)),
    });

    if (cancel) {
        return { cancel };
    }

    if (fetchResult.error && fetchResult.error.code === 401) {
        const { locationBeforeTransitions } = yield select(getCurrentLocation);

        yield put(replace({
            pathname: '/login',
            state: { nextPathname: locationBeforeTransitions.pathname },
        }));
    }

    return fetchResult;
}
