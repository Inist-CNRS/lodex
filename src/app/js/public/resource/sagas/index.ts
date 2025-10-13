import { fork } from 'redux-saga/effects';

import loadResource from './loadResource';
import saveResource from './saveResource';
import addFieldToResource from './addFieldToResource';
import changeFieldStatus from './changeFieldStatus';

export default function* () {
    yield fork(loadResource);
    yield fork(saveResource);
    yield fork(addFieldToResource);
    yield fork(changeFieldStatus);
}
