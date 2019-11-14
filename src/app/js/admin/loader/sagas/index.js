import { fork } from 'redux-saga/effects';
import loadLoaders from './loadLoaders';

export default function*() {
    yield fork(loadLoaders);
}
