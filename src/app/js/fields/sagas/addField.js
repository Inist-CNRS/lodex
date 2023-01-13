import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { ADD_FIELD } from '../';

export function* handleAddField({ payload }) {
    const { scope } = payload;
    if (scope) {
        yield put(push(`/display/${scope}/edit/new`));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleAddField);
}
