import { fork } from 'redux-saga/effects';

import loadResource from './loadResource';
import saveResource from './saveResource';

export default function* () {
    yield fork(loadResource);
    yield fork(saveResource);
}
