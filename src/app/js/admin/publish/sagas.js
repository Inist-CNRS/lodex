import { call, put, select, takeLatest } from 'redux-saga/effects';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

import { PUBLISH, publishError } from './';

export function* handlePublishRequest() {
    try {
        const request = yield select(fromUser.getPublishRequest);
        const { error } = yield call(fetchSaga, request);

        if (error) {
            yield put(publishError(error));
            return;
        }
    } catch (e) {
        console.log(e);
    }
}

export default function* () {
    yield takeLatest(PUBLISH, handlePublishRequest);
}
