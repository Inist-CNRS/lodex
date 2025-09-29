import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    LOAD_REMOVED_RESOURCE_PAGE,
    loadRemovedResourcePageSuccess,
    loadRemovedResourcePageError,
} from '../';
import fetchSaga from '../../../lib/sagas/fetchSaga';
import { fromUser } from '../../../sharedSelectors';

// @ts-expect-error TS7031
export function* handleLoadRemovedResourcePageRequest({ payload }) {
    // @ts-expect-error TS7057
    const request = yield select(
        // @ts-expect-error TS2339
        fromUser.getLoadRemovedResourcePageRequest,
        payload,
    );
    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
        return yield put(loadRemovedResourcePageError(error));
    }

    const { data: resources, total } = response;
    // @ts-expect-error TS7057
    return yield put(
        loadRemovedResourcePageSuccess({
            resources,
            page: payload.page,
            total,
        }),
    );
}

export default function* () {
    yield takeLatest(
        // @ts-expect-error TS2769
        LOAD_REMOVED_RESOURCE_PAGE,
        handleLoadRemovedResourcePageRequest,
    );
}
