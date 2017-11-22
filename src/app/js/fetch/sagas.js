import { race, call, put, take, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../lib/sagas/fetchSaga';

import { FETCH, fetchError, fetchSuccess } from './';

export const filterAction = action =>
    action.type === FETCH && action.meta && action.meta.name === name;

export function* handleFetch({ payload: config, meta: { name } }) {
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
    yield takeLatest(FETCH, handleFetch);
}
