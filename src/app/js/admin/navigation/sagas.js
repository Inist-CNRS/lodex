import { LOCATION_CHANGE } from 'connected-react-router';
import { takeLatest, fork, put } from 'redux-saga/effects';

import { hideAddColumns } from '../parsing';

export function* handleExitShowColumns() {
    yield put(hideAddColumns());
}

export function* watchChangeLocation() {
    yield takeLatest(LOCATION_CHANGE, handleExitShowColumns);
}

export default function* () {
    yield fork(watchChangeLocation);
}
