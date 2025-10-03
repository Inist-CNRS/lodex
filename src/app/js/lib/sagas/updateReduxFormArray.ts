import { put, select, all } from 'redux-saga/effects';
import { change, arrayRemove, formValueSelector } from 'redux-form';

// redux-form do not allow to change whole array of field at once, if one of the field has been changed
// @ts-expect-error TS7006
export default function* updateArray(formName, fieldName, values) {
    const currentArray =
        // @ts-expect-error TS7057
        (yield select(formValueSelector(formName), fieldName)) || [];
    // get the lengths of the two sets of items
    const newArrayLength = values.length;

    // change each item individually
    yield all(
        // @ts-expect-error TS7006
        values.map((item, i) =>
            put(change(formName, `${fieldName}[${i}]`, item)),
        ),
    );

    // manually remove any items if the new list is shorter than the old list
    for (let i = newArrayLength; i < currentArray.length; i += 1) {
        yield put(arrayRemove(formName, fieldName, i));
    }
}
