import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    UPDATE_CHARACTERISTICS,
    updateCharacteristicsError,
    updateCharacteristicsSuccess,
} from '../reducer';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { configureFieldSuccess } from '../../fields/reducer';

// @ts-expect-error TS7031
export function* handleUpdateCharacteristics({ payload }) {
    // @ts-expect-error TS7057
    const request = yield select(
        fromUser.getUpdateCharacteristicsRequest,
        payload,
    );

    const { error, response } = yield call(fetchSaga, request);

    if (error) {
        // @ts-expect-error TS7057
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

export default function* () {
    // @ts-expect-error TS2769
    yield takeLatest(UPDATE_CHARACTERISTICS, handleUpdateCharacteristics);
}
