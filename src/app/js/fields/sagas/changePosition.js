import { takeEvery, call, select, put } from 'redux-saga/effects';
import {
    CHANGE_POSITION,
    changePositionValue as changePosition,
} from '../';

import { fromFields, fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';

export const move = (tab, previousIndex, newIndex) => {
    const array = tab.slice(0);
    if (newIndex >= array.length) {
        let k = newIndex - array.length - 1;
        while (k + 1) {
            array.push(undefined);
            k -= 1;
        }
    }
    array.splice(newIndex, 0, array.splice(previousIndex, 1)[0]);

    return array
        .map((e, i) => ({ ...e, position: i }))
        .filter(e => tab.some(f => f.name === e.name && f.position !== e.position));
};

export function* handleChangePosition({ payload: { newPosition, oldPosition } }) {
    const fields = yield select(fromFields.getFields);
    const resultArray = yield call(move, fields, oldPosition, newPosition);

    yield put(changePosition({ fields: resultArray }));

    for (let i = 0; i < resultArray.length; i += 1) {
        const request = yield select(fromUser.getUpdateFieldRequest, resultArray[i]);
        const { error } = yield call(fetchSaga, request);
        if (error) {
            yield put(changePosition({ fields: [fields.find(e => e.name === resultArray[i].name)] }));
        }
    }
}

export default function* watchLoadField() {
    yield takeEvery([CHANGE_POSITION], handleChangePosition);
}
