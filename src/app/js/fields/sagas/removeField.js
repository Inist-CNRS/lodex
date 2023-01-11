import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { REMOVE_FIELD, removeFieldError, removeFieldSuccess } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { SCOPE_DOCUMENT } from '../../../../common/scope';

export function* handleRemoveField({ payload }) {
    const {
        field: { name, subresourceId },
        filter,
    } = payload;

    const redirectingPath = `/display/${filter}${
        filter === SCOPE_DOCUMENT && subresourceId ? `/${subresourceId}` : ''
    }`;
    const field = yield select(fromFields.getFieldByName, name);
    const request = yield select(fromUser.getRemoveFieldRequest, field);

    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(removeFieldError(error));
    } else {
        yield put(removeFieldSuccess(field));
    }
    yield put(push(redirectingPath));
}

export default function* watchLoadField() {
    yield takeLatest([REMOVE_FIELD], handleRemoveField);
}
