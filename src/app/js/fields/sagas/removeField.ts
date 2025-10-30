import { call, put, select, takeLatest } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { REMOVE_FIELD, removeFieldError, removeFieldSuccess } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { SCOPE_DOCUMENT } from '@lodex/common';

// @ts-expect-error TS7031
export function* handleRemoveField({ payload }) {
    const {
        field: { name, subresourceId },
        filter,
    } = payload;

    const redirectingPath = `/display/${filter}${
        filter === SCOPE_DOCUMENT && subresourceId
            ? `/subresource/${subresourceId}`
            : ''
    }`;
    // @ts-expect-error TS7057
    const field = yield select(fromFields.getFieldByName, name);
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getRemoveFieldRequest, field);

    const { error } = yield call(fetchSaga, request);
    yield put(push(redirectingPath));

    if (error) {
        yield put(removeFieldError(error));
    } else {
        yield put(removeFieldSuccess(field));
    }
}

export default function* watchLoadField() {
    // @ts-expect-error TS2769
    yield takeLatest([REMOVE_FIELD], handleRemoveField);
}
