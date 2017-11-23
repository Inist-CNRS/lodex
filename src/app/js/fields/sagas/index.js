import { fork } from 'redux-saga/effects';

import loadFields from './loadFields';
import removeField from './removeField';
import saveField from './saveField';
import validation from './validation';
import changeOperation from './changeOperation';
import changePosition from './changePosition';
import loadPublication from './loadPublication';
import configureField from './configureField';
import addCharacteristic from './addCharacteristic';

export default function*() {
    yield fork(loadFields);
    yield fork(removeField);
    yield fork(saveField);
    yield fork(validation);
    yield fork(changeOperation);
    yield fork(changePosition);
    yield fork(loadPublication);
    yield fork(configureField);
    yield fork(addCharacteristic);
}
