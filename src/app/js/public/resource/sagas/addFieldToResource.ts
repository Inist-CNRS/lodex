import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    addFieldToResourceSuccess,
    addFieldToResourceError,
    getNewResourceFieldFormData,
    ADD_FIELD_TO_RESOURCE,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleAddFieldToResource({ payload: uri }) {
    const formData = yield select(getNewResourceFieldFormData);
    if (!formData.field) {
        yield put(
            addFieldToResourceError(
                new Error('You need to select a field or create a new one'),
            ),
        );
        return;
    }
    const request = yield select(fromUser.getAddFieldToResourceRequest, {
        ...formData,
        uri,
    });
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(addFieldToResourceError(error));
        return;
    }

    yield put(addFieldToResourceSuccess(response));
}

export default function* watchAddFieldToResource() {
    yield takeLatest(ADD_FIELD_TO_RESOURCE, handleAddFieldToResource);
}
