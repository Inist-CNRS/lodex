import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
} from '../';
import { fromUser } from '../../../sharedSelectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleLoadPublicationRequest() {
    const request = yield select(fromUser.getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        return yield put(loadPublicationError(error));
    }

    return yield put(loadPublicationSuccess(publication));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_PUBLICATION], handleLoadPublicationRequest);
}
