import { call, fork, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_PUBLICATION,
    loadPublicationSuccess,
    loadPublicationError,
    computePublication,
} from './index';
import { PUBLISH_ERROR, PUBLISH_SUCCESS } from '../publish';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';

// @ts-expect-error TS7031
export function* handleLoadPublicationRequest({ payload }) {
    // @ts-expect-error TS7057
    const request = yield select(fromUser.getLoadPublicationRequest);

    const { error, response: publication } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadPublicationError(error));
    }

    yield put(loadPublicationSuccess(publication));

    if (payload && payload.forcePostComputation) {
        yield put(computePublication());
    }
}

export function* watchLoadPublicationRequest() {
    yield takeLatest(
        // @ts-expect-error TS2769
        [LOAD_PUBLICATION, PUBLISH_SUCCESS, PUBLISH_ERROR],
        handleLoadPublicationRequest,
    );
}

export default function* () {
    yield fork(watchLoadPublicationRequest);
}
