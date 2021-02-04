import { call, put, take, race, select, takeLatest } from 'redux-saga/effects';

import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { FINISH_PROGRESS, ERROR_PROGRESS } from '../progress/reducer';

import { PUBLISH, publishSuccess, publishError } from './';

export function* handlePublishRequest() {
    try {
        const request = yield select(fromUser.getPublishRequest);
        const { error } = yield call(fetchSaga, request);

        if (error) {
            yield put(publishError(error));
            return;
        }

        const { progressError } = yield race({
            progressFinish: take(FINISH_PROGRESS),
            progressError: take(ERROR_PROGRESS),
        });

        if (progressError) {
            yield put(publishError(progressError.payload.error));
            return;
        }

        yield put(publishSuccess());
    } catch (e) {
        console.log(e);
    }
}

export default function*() {
    yield takeLatest(PUBLISH, handlePublishRequest);
}
