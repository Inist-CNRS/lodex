import { call, put, select, takeLatest } from 'redux-saga/effects';
import {
    loadField,
    REMOVE_FIELD_LIST,
    removeFieldListError,
    removeFieldListSuccess,
} from '../';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromFields, fromUser } from '../../sharedSelectors';

export function* handleRemoveFieldList({ payload }) {
    const { fields } = payload;

    try {
        for (const { name } of fields) {
            const field = yield select(fromFields.getFieldByName, name);
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
    yield takeLatest([REMOVE_FIELD_LIST], handleRemoveFieldList);
}
