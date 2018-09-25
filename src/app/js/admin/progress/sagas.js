import { takeEvery, call, select, put } from 'redux-saga/effects';

import { updateProgress, errorProgress } from './reducer';
import { PUBLISH } from '../publish';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

export function* handleStartProgressSaga() {
    while (true) {
        yield delay(1000);
        const request = yield select(fromUser.getProgressRequest);
        const { error, response } = yield call(fetchSaga, request);
        if (error) {
            yield put(errorProgress(error));
            break;
        }

        yield put(updateProgress(response));

        if (response.status === 'pending') {
            return;
        }
    }
}

export default function* progressSaga() {
    yield takeEvery(PUBLISH, handleStartProgressSaga);
}
