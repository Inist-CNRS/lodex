import { select, takeEvery, call } from 'redux-saga/effects';

import {
    CHANGE_OPERATION,
} from '../';
import { fromFields } from '../../selectors';
import updateReduxFormArray from '../../../lib/updateReduxFormArray';

export function* handleChangeOperation({ payload: { operation, fieldName } }) {
    const transformerArgs = yield select(fromFields.getTransformerArgs, operation);
    yield call(updateReduxFormArray, 'field', `${fieldName}.args`, transformerArgs);
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_OPERATION], handleChangeOperation);
}
