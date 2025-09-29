import { takeEvery, call, select, put } from 'redux-saga/effects';
import { changePositionValue, CHANGE_POSITIONS } from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

// @ts-expect-error TS7006
export const movePosition = (fields, oldPosition, newPosition) => {
    // @ts-expect-error TS7006
    const fieldToMove = fields.find((field) => field.position === oldPosition);

    const newIndex = fields.findIndex(
        // @ts-expect-error TS7006
        (field) => field.position === newPosition,
    );

    const otherFields = fields.filter(
        // @ts-expect-error TS7006
        (field) => field.position !== oldPosition,
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
    // @ts-expect-error TS7031
    payload: { newPosition, oldPosition, type },
}) {
    // @ts-expect-error TS7057
    const fields = yield select(fromFields.getOntologyFields, type);
    // @ts-expect-error TS7057
    const reorderedFields = yield call(
        movePosition,
        fields,
        oldPosition,
        newPosition,
    );

    yield put(changePositionValue({ fields: reorderedFields }));

    // @ts-expect-error TS7057
    const request = yield select(
        // @ts-expect-error TS2339
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

export function* handleChangePositions({
    // @ts-expect-error TS7031
    payload: { type, fields: reorderedFields },
}) {
    // @ts-expect-error TS7057
    const fields = yield select(fromFields.getOntologyFieldsWithUri, type);
    yield put(changePositionValue({ fields: reorderedFields }));

    // @ts-expect-error TS7057
    const request = yield select(
        // @ts-expect-error TS2339
        fromUser.getReorderFieldRequest,
        reorderedFields,
    );

    const { error } = yield call(fetchSaga, request);
    if (error) {
        yield put(changePositionValue({ fields }));
        return;
    }
}

export default function* watchLoadField() {
    // @ts-expect-error TS2769
    yield takeEvery([CHANGE_POSITIONS], handleChangePositions);
}
