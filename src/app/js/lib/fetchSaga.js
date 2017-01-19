import { call, take, race } from 'redux-saga/effects';
import fetch from './fetch';

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

    return fetchResult;
}
