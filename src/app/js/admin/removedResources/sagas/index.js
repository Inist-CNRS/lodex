import { fork } from 'redux-saga/effects';
import loadRemovedResource from './loadRemovedResource';
import restoreResource from './restoreResource';

export default [
    loadRemovedResource,
    restoreResource,
];
