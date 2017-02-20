import { fork } from 'redux-saga/effects';

import characteristicSaga from './characteristic/sagas';
import datasetSaga from './dataset/sagas';
import resourceSagas from './resource/sagas';
import publicationSagas from './publication/sagas';

export default function* () {
    yield fork(publicationSagas);
    yield fork(characteristicSaga);
    yield fork(datasetSaga);
    yield fork(resourceSagas);
}
