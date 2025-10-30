import { race, call, put, take, takeLatest, delay } from 'redux-saga/effects';

import fetchSaga from './fetchSaga';

import { FETCH, fetchError, fetchSuccess } from './reducer';

// @ts-expect-error TS7006
export const filterAction = (action) =>
    action.type === FETCH && action.meta && action.meta.name === name;

// @ts-expect-error TS7031
export function* handleFetch({ payload: config, meta: { name } }) {
    yield delay(200);
    const { fetch } = yield race({
        fetch: call(fetchSaga, config),
        cancel: take(filterAction),
    });

    if (fetch) {
        const { response, error } = fetch;

        if (error) {
            yield put(fetchError({ error, name }));
            return;
        }

        yield put(fetchSuccess({ response, name }));
    }
}

export default function* watchFetch() {
    // @ts-expect-error TS2769
    yield takeLatest(FETCH, handleFetch);
}
