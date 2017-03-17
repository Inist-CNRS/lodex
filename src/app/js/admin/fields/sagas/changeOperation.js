import { put, select, takeEvery } from 'redux-saga/effects';
import { change } from 'redux-form';

import {
    CHANGE_OPERATION,
} from '../';
import { fromFields } from '../../selectors';

export function* handleChangeOperation({ payload: { operation, fieldName } }) {
    const transformerArgs = yield select(fromFields.getTransformerArgs, operation);
    yield put(change('field', `${fieldName}.args`, transformerArgs));
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_OPERATION], handleChangeOperation);
}
