import { call, put, select, takeLatest } from 'redux-saga/effects';
// @ts-expect-error TS7016
import isEqual from 'lodash/isEqual';

import { saveResourceSuccess, saveResourceError, SAVE_RESOURCE } from '../';

import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromResource } from '../../selectors';

// @ts-expect-error TS7031
export function* handleSaveResource({ payload: { resource, field } }) {
    // @ts-expect-error TS7057
    const oldResource = yield select(fromResource.getResourceLastVersion);
    if (!isEqual(oldResource, resource)) {
        // @ts-expect-error TS7057
        const request = yield select(fromUser.getSaveResourceRequest, {
            resource,
            field,
        });
        const { error, response } = yield call(fetchSaga, request);

        if (error) {
            yield put(saveResourceError(error));
            return;
        }

        yield put(saveResourceSuccess(response.value));
        return;
    }

    yield put(saveResourceSuccess());
}

export default function* watchSaveResource() {
    // @ts-expect-error TS2769
    yield takeLatest(SAVE_RESOURCE, handleSaveResource);
}
