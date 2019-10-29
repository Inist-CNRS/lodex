import { call, takeEvery, select, put } from 'redux-saga/effects';

import {
    PRE_LOAD_LOADERS,
    loadLoaders,
    loadLoadersError,
    loadLoadersSuccess,
} from '..';
import { fromUser } from '../../../sharedSelectors';
import { fromLoaders } from '../../selectors';
import fetchSaga from '../../../lib/sagas/fetchSaga';

export function* handleLoadLoaders() {
    if (yield select(fromLoaders.areLoadersLoaded)) {
        return;
    }
    yield put(loadLoaders());
    const request = yield select(fromUser.getLoadLoadersRequest);
    const { response, error } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadLoadersError(error));
        return;
    }

    yield put(loadLoadersSuccess(response));
}

export default function*() {
    yield takeEvery(PRE_LOAD_LOADERS, handleLoadLoaders);
}
