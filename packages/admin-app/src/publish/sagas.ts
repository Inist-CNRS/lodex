import { call, put, select, takeLatest } from 'redux-saga/effects';

import { fromUser } from '@lodex/frontend-common/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

import { PUBLISH, publishError } from './index';

export function* handlePublishRequest() {
    try {
        // @ts-expect-error TS7057
        const request = yield select(fromUser.getPublishRequest);
        const { error } = yield call(fetchSaga, request);

        if (error) {
            yield put(publishError(error));
            return;
        }
    } catch (e) {
        global.console.log(e);
    }
}

export default function* () {
    yield takeLatest(PUBLISH, handlePublishRequest);
}
