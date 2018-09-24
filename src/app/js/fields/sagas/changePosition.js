import { takeEvery, call, select, put } from 'redux-saga/effects';
import { CHANGE_POSITION, changePositionValue } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export const movePosition = (fields, oldPosition, newPosition) => {
    const fieldToMove = fields.find(field => field.position === oldPosition);

    const newIndex = fields.findIndex(field => field.position === newPosition);

    const otherFields = fields.filter(field => field.position !== oldPosition);

    const reorderedFields = [
        ...otherFields.slice(0, newIndex),
        fieldToMove,
        ...otherFields.slice(newIndex),
    ];

    return reorderedFields.map((field, index) => ({
        ...field,
        position: index,
    }));
};

export function* handleChangePosition({
    payload: { newPosition, oldPosition, type },
}) {
    const fields = yield select(fromFields.getOntologyFields, type);
    const reorderedFields = yield call(
        movePosition,
        fields,
        oldPosition,
        newPosition,
    );

    yield put(changePositionValue({ fields: reorderedFields }));

    const request = yield select(
        fromUser.getReorderFieldRequest,
        reorderedFields,
    );
    const { error, response } = yield call(fetchSaga, request);
    if (error) {
        yield put(changePositionValue({ fields }));
        return;
    }

    yield put(changePositionValue({ fields: response }));
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_POSITION], handleChangePosition);
}
