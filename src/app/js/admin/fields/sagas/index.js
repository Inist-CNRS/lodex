import { fork } from 'redux-saga/effects';
import createField from './createField';
import loadFields from './loadFields';
import removeField from './removeField';
import updateField from './updateField';

export default function* () {
    yield fork(createField);
    yield fork(loadFields);
    yield fork(removeField);
    yield fork(updateField);
}
