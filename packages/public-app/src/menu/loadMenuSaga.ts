import { call, put, select, takeLatest } from 'redux-saga/effects';

import { LOAD_MENU, loadMenuSuccess, loadMenuError } from './reducer';
import { fromMenu } from '../selectors';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';

export function* handleLoadMenu() {
    // @ts-expect-error TS7057
    const menu = yield select(fromMenu.hasMenu);
    if (menu) {
        return;
    }

    // @ts-expect-error TS7057
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
