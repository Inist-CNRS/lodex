import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'redux-first-history';

import { ADD_FIELD } from '../';
import { SCOPE_DOCUMENT } from '@lodex/common';

// @ts-expect-error TS7006
const getAddFieldRedirectUrl = (scope, subresourceId) => {
    if (scope === SCOPE_DOCUMENT) {
        if (subresourceId) {
            return `/display/${scope}/subresource/${subresourceId}/edit/new`;
        }
        return `/display/${scope}/main/edit/new`;
    }
    return `/display/${scope}/edit/new`;
};

// @ts-expect-error TS7031
export function* handleAddField({ payload }) {
    const { scope, subresourceId } = payload;
    if (scope) {
        const redirectUrl = getAddFieldRedirectUrl(scope, subresourceId);
        yield put(push(redirectUrl));
    }
}

export default function* watchLoadField() {
    // @ts-expect-error TS2769
    yield takeLatest([ADD_FIELD], handleAddField);
}
