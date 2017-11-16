import { fork, all } from 'redux-saga/effects';

import characteristicSaga from './characteristic/sagas';
import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import exportFieldsSaga from '../exportFields/sagas';
import facetSaga from './facet/sagas';
import fetchSaga from '../fetch/sagas';
import i18nSaga from '../i18n/sagas';
import fieldsSagas from '../fields/sagas';
import resourceSagas from './resource/sagas';
import userSagas from '../user/sagas';

export default function* () {
    yield all(characteristicSaga.map(fork));
    yield fork(function* () { yield fork(datasetSaga); });
    yield fork(exportSaga);
    yield fork(exportFieldsSaga);
    yield fork(facetSaga);
    yield fork(fetchSaga);
    yield all(i18nSaga.map(fork));
    yield all(fieldsSagas.map(fork));
    yield all(resourceSagas.map(fork));
    yield fork(userSagas);
}
