import { call, put, select, takeLatest } from 'redux-saga/effects';
import validateFields from '../../../../../common/validateFields';

import {
    setValidation,
    ADD_FIELD,
    EDIT_FIELD,
    LOAD_FIELD_SUCCESS,
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
        ADD_FIELD,
        EDIT_FIELD,
        LOAD_FIELD_SUCCESS,
        REMOVE_FIELD_SUCCESS,
        SAVE_FIELD_SUCCESS,
    ], handleNeedValidation);
}
