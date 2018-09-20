import { takeEvery, call, select, put } from 'redux-saga/effects';
import { CHANGE_POSITION, changePositionValue } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export const move = (fields, oldPosition, newPosition) => {
    const fieldToMove = fields.find(field => field.position === oldPosition);
    const sortedFields = fields
        .filter(field => field.position !== oldPosition)
        .sort((a, b) => a.position - b.position);

    const reorderedFields = [
        ...sortedFields.slice(0, newPosition),
        fieldToMove,
        ...sortedFields.slice(newPosition),
    ];

    return reorderedFields.map((field, index) => ({
        ...field,
        position: index,
    }));
};

export function* handleChangePosition({
    payload: { newPosition, oldPosition },
}) {
    const fields = yield select(fromFields.getFields);
    const sortedFields = yield call(move, fields, oldPosition, newPosition);

    yield put(changePositionValue({ fields: sortedFields }));

    for (let i = 0; i < sortedFields.length; i += 1) {
        const request = yield select(
            fromUser.getUpdateFieldRequest,
            sortedFields[i],
        );
        const { error } = yield call(fetchSaga, request);
        if (error) {
            yield put(
                changePositionValue({
                    fields: [fields.find(e => e.name === sortedFields[i].name)],
                }),
            );
        }
    }
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_POSITION], handleChangePosition);
}
