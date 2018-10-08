import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from '../';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { configureFieldSuccess } from '../../fields/index';

export function* handleUpdateCharacteristics({ payload }) {
    const request = yield select(
        fromUser.getUpdateCharacteristicsRequest,
        payload,
    );

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        return yield put(updateCharacteristicsError(error));
    }

    const { characteristics, field } = response;

    yield put(
        updateCharacteristicsSuccess({
            characteristics,
            field: field || { name: payload.name },
        }),
    );

    if (field) {
        yield put(configureFieldSuccess({ field }));
    }
}

export default function*() {
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}
