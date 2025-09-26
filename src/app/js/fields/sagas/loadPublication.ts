import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    PRE_LOAD_PUBLICATION,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
} from '../';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadPublicationRequest() {
    if ((yield select(fromFields.getNbFields)) > 0) {
        return;
    }
    yield put(loadPublication());
    const request = yield select(fromUser.getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadPublicationError(error));
        return;
    }

    yield put(loadPublicationSuccess(publication));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([PRE_LOAD_PUBLICATION], handleLoadPublicationRequest);
}
