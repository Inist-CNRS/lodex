import { fork } from 'redux-saga/effects';
import addField from './addField';
import loadFields from './loadFields';
import removeField from './removeField';
import updateField from './updateField';
import validation from './validation';

export default function* () {
    yield fork(addField);
    yield fork(loadFields);
    yield fork(removeField);
    yield fork(updateField);
    yield fork(validation);
}
