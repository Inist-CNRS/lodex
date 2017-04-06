import { fork } from 'redux-saga/effects';

import exportPublishedDataset from './exportPublishedDataset';
import loadExporters from './loadExporters';

export default function* () {
    yield fork(exportPublishedDataset);
    yield fork(loadExporters);
}
