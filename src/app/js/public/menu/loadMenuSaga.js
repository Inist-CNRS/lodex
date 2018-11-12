import { call, put, select, takeLatest } from 'redux-saga/effects';

import { LOAD_MENU, loadMenuSuccess, loadMenuError } from './reducer';
import { fromMenu } from '../selectors';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export function* handleLoadMenu() {
    const menu = yield select(fromMenu.hasMenu);
    if (menu) {
        return;
    }

    const request = yield select(fromUser.getMenuRequest);

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        yield put(loadMenuError(error.message));
        return;
    }

    yield put(loadMenuSuccess(response));
}

export default function* watchLoadPublicationRequest() {
    yield takeLatest([LOAD_MENU], handleLoadMenu);
}
