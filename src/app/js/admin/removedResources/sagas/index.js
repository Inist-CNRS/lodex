import { fork } from 'redux-saga/effects';
import loadRemovedResource from './loadRemovedResource';
import restoreResource from './restoreResource';

export default function*() {
    yield fork(loadRemovedResource);
    yield fork(restoreResource);
}
