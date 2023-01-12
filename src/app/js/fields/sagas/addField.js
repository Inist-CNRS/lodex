import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { ADD_FIELD } from '../';

export function* handleAddField({ payload }) {
    const { filter } = payload;
    if (filter) {
        yield put(push(`/display/${filter}/edit`));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleAddField);
}
