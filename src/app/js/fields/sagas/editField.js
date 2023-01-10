import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { EDIT_FIELD } from '../';
import { SCOPE_DOCUMENT } from '../../../../common/scope';

export function* handleEditField({ payload }) {
    const { field, filter, subresourceId } = payload;
    if (filter) {
        if (field) {
            yield put(push(`/display/${filter}/edit`));
        } else {
            yield put(
                push(
                    `/display/${filter}${
                        filter === SCOPE_DOCUMENT && subresourceId
                            ? `/${subresourceId}`
                            : ''
                    }`,
                ),
            );
        }
    }
}

export default function* watchLoadField() {
    yield takeLatest([EDIT_FIELD], handleEditField);
}
