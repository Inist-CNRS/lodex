import { fork } from 'redux-saga/effects';

import loadPublication from './loadPublication';
import saveField from './saveField';

export default function* () {
    yield fork(loadPublication);
    yield fork(saveField);
}
