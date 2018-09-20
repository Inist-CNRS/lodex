import { takeEvery, call, select, put } from 'redux-saga/effects';
import { CHANGE_POSITION, changePositionValue } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export const movePosition = (fields, oldPosition, newPosition) => {
    const sortedFields = fields
        .slice(0)
        .sort((a, b) => a.position - b.position);

    const fieldToMove = sortedFields.find(
        field => field.position === oldPosition,
    );

    const newIndex = sortedFields.findIndex(
        field => field.position === newPosition,
    );

    const otherFields = sortedFields.filter(
        field => field.position !== oldPosition,
    );

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
    payload: { newPosition, oldPosition },
}) {
    const fields = yield select(fromFields.getFields);
    const sortedFields = yield call(
        movePosition,
        fields,
        oldPosition,
        newPosition,
    );

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
