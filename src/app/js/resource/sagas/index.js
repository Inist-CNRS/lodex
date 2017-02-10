import { fork } from 'redux-saga/effects';

import loadResource from './loadResource';
import saveResource from './saveResource';
import hideResource from './hideResource';

export default function* () {
    yield fork(loadResource);
    yield fork(saveResource);
    yield fork(hideResource);
}
