import { call, put, select, takeLatest } from 'redux-saga/effects';
import isEqual from 'lodash.isequal';

import {
    saveResourceSuccess,
    saveResourceError,
    SAVE_RESOURCE,
} from '../';

import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromResource } from '../../selectors';

export function* handleSaveResource({ payload: resource }) {
    const oldResource = yield select(fromResource.getResourceLastVersion);
    if (!isEqual(oldResource, resource)) {
        const request = yield select(fromUser.getSaveResourceRequest, resource);
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
    yield takeLatest(SAVE_RESOURCE, handleSaveResource);
}
