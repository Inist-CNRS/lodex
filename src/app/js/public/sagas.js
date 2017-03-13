import { fork } from 'redux-saga/effects';

import characteristicSaga from './characteristic/sagas';
import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import facetSaga from './facet/sagas';
import fetchSaga from '../fetch/sagas';
import i18nSaga from '../i18n/sagas';
import publicationSagas from './publication/sagas';
import resourceSagas from './resource/sagas';
import userSagas from '../user/sagas';

export default function* () {
    yield fork(characteristicSaga);
    yield fork(datasetSaga);
    yield fork(exportSaga);
    yield fork(facetSaga);
    yield fork(fetchSaga);
    yield fork(i18nSaga);
    yield fork(publicationSagas);
    yield fork(resourceSagas);
    yield fork(userSagas);
}
