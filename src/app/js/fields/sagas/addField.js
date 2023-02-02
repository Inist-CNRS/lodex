import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { ADD_FIELD } from '../';
import { SCOPE_DOCUMENT } from '../../../../common/scope';

const getAddFieldRedirectUrl = (scope, subresourceId) => {
    if (scope === SCOPE_DOCUMENT) {
        if (subresourceId) {
            return `/display/${scope}/subresource/${subresourceId}/edit/new`;
        }
        return `/display/${scope}/main/edit/new`;
    }
    return `/display/${scope}/edit/new`;
};

export function* handleAddField({ payload }) {
    const { scope, subresourceId } = payload;
    if (scope) {
        const redirectUrl = getAddFieldRedirectUrl(scope, subresourceId);
        yield put(push(redirectUrl));
    }
}

export default function* watchLoadField() {
    yield takeLatest([ADD_FIELD], handleAddField);
}
