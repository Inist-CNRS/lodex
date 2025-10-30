import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    loadField,
    REMOVE_FIELD_LIST,
    removeFieldListError,
    removeFieldListStarted,
    removeFieldListSuccess,
} from '../';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import { fromFields, fromUser } from '../../sharedSelectors';

// @ts-expect-error TS7031
export function* handleRemoveFieldList({ payload }) {
    const { fields } = payload;

    yield put(removeFieldListStarted());

    try {
        // Usage of for as it eases testing since we can catch easily selects and calls
        for (const { name } of fields) {
            // @ts-expect-error TS7057
            const field = yield select(fromFields.getFieldByName, name);
            // @ts-expect-error TS7057
            const request = yield select(fromUser.getRemoveFieldRequest, field);
            const { error } = yield call(fetchSaga, request);
            if (error) {
                throw error;
            }
        }

        yield put(removeFieldListSuccess(fields));
    } catch (error) {
        yield put(removeFieldListError(error));
    } finally {
        yield put(loadField());
    }
}

export default function* watchLoadField() {
    // @ts-expect-error TS2769
    yield takeLatest([REMOVE_FIELD_LIST], handleRemoveFieldList);
}
