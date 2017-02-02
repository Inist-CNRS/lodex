import { takeLatest } from 'redux-saga';
import { call, put, select } from 'redux-saga/effects';
import { CHANGE as REDUX_FORM_CHANGE } from 'redux-form/lib/actionTypes';
import { getFieldFormData, getTransformerArgs, saveField } from './';

export function* prepareTransformer(transformer) {
    const args = yield select(getTransformerArgs, transformer.operation);
    const originalArgs = transformer.args || args;

    return {
        ...transformer,
        args: (args || []).map(a => ({
            ...a,
            value: originalArgs.find(originalArg => a.name === originalArg.name).value,
        })),
    };
}

export function* prepareTransformers(transformers) {
    if (!transformers || transformers.length === 0) {
        return [];
    }

    return yield transformers.map(transformer => call(prepareTransformer, transformer));
}

export function* handleSaveField({ meta: { form } }) {
    if (form !== 'field') {
        return;
    }
    const fieldData = yield select(getFieldFormData);
    fieldData.transformers = yield call(prepareTransformers, fieldData.transformers);

    yield put(saveField(fieldData));
}

export default function* watchLoadField() {
    yield takeLatest([REDUX_FORM_CHANGE], handleSaveField);
}
