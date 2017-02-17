import { call, put, select, takeLatest } from 'redux-saga/effects';
import validateFields from '../../../../common/validateFields';

import {
    setValidation,
} from './';

import {
    LOAD_FIELD_SUCCESS,
    ADD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    UPDATE_FIELD_SUCCESS,
} from '../fields';
import { fromFields } from '../../selectors';

export function* handleNeedValidation() {
    const fields = yield select(fromFields.getFields);
    const validation = yield call(validateFields, fields);

    yield put(setValidation(validation));
}

export default function* watch() {
    yield takeLatest([
        LOAD_FIELD_SUCCESS,
        ADD_FIELD_SUCCESS,
        REMOVE_FIELD_SUCCESS,
        UPDATE_FIELD_SUCCESS,
    ], handleNeedValidation);
}
