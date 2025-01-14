import { call, put, race, select, take } from 'redux-saga/effects';
import { replace } from 'redux-first-history';
import fetch from '../fetch';
import { logout } from '../../user';
import { getCurrentQuery } from '../../sharedSelectors';

export default function* fetchSaga(
    request,
    interruptingActions = [],
    mode = 'json',
) {
    const { fetchResult, cancel } = yield race({
        fetchResult: call(fetch, request, mode),
        cancel: take([].concat(interruptingActions)),
    });

    if (cancel) {
        return { cancel };
    }

    if (fetchResult.error && fetchResult.error.code === 401) {
        const pathname = yield select(getCurrentQuery);
        if (!pathname.startsWith('/login')) {
            yield put(
                replace({
                    pathname: `/login?page=${encodeURIComponent(pathname)}`,
                }),
            );
            window.location.reload();
        }

        yield put(logout());
    }

    return fetchResult;
}
