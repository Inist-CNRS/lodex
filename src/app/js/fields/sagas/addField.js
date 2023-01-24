import { put, takeLatest } from 'redux-saga/effects';
import { push } from 'connected-react-router';

import { ADD_FIELD } from '../';
import { SCOPE_DOCUMENT } from '../../../../common/scope';

const getAddFieldRedirectUrl = (scope, subresourceId) => {
    const redirectUrl =
        scope === SCOPE_DOCUMENT
            ? `/display/${scope}/${subresourceId || 'main'}/edit/new`
            : `/display/${scope}/edit/new`;
    return redirectUrl;
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
