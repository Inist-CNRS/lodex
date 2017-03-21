import { call, put, select, takeLatest } from 'redux-saga/effects';
import validateFields from '../../../../../common/validateFields';

import {
    LOAD_FIELD_SUCCESS,
    setValidation,
    ADD_FIELD,
    REMOVE_FIELD_SUCCESS,
    SAVE_FIELD_SUCCESS,
} from '../';

import { fromFields } from '../../selectors';

export function* handleNeedValidation() {
    const fields = yield select(fromFields.getFields);
    const validation = yield call(validateFields, fields);

    yield put(setValidation(validation));
}

export default function* watch() {
    yield takeLatest([
        LOAD_FIELD_SUCCESS,
        ADD_FIELD,
        REMOVE_FIELD_SUCCESS,
        SAVE_FIELD_SUCCESS,
    ], handleNeedValidation);
}
