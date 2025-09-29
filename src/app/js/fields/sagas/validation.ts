import { call, put, select, takeLatest } from 'redux-saga/effects';
// @ts-expect-error TS7016
import validateFields from '../../../../common/validateFields';

import {
    setValidation,
    LOAD_FIELD_SUCCESS,
    REMOVE_FIELD_SUCCESS,
    LOAD_PUBLICATION_SUCCESS,
} from '../';

import { fromFields } from '../../sharedSelectors';

export function* handleNeedValidation() {
    // @ts-expect-error TS7057
    const fields = yield select(fromFields.getFields);
    // @ts-expect-error TS7057
    const validation = yield call(validateFields, fields);

    yield put(setValidation(validation));
}

export default function* watch() {
    yield takeLatest(
        [LOAD_FIELD_SUCCESS, REMOVE_FIELD_SUCCESS, LOAD_PUBLICATION_SUCCESS],
        handleNeedValidation,
    );
}
