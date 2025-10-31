import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    PRE_LOAD_PUBLICATION,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
} from '../reducer';
import { fromUser, fromFields } from '../../sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

export function* handleLoadPublicationRequest() {
    // @ts-expect-error TS7057
    if ((yield select(fromFields.getNbFields)) > 0) {
        return;
    }
    yield put(loadPublication());
    // @ts-expect-error TS7057
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
