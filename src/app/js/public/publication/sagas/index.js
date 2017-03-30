import { fork } from 'redux-saga/effects';

import loadPublication from './loadPublication';
import configureField from './configureField';

export default function* () {
    yield fork(loadPublication);
    yield fork(configureField);
}
