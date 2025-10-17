import { fork } from 'redux-saga/effects';

import characteristicSaga from '../characteristic/sagas';
import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import exportFieldsSaga from '../exportFields/sagas';
import fetchSaga from '../fetch/sagas';
import i18nSaga from '../i18n/sagas';
import fieldsSagas from '../fields/sagas';
import resourceSagas from './resource/sagas';
import graphSagas from '../formats/sagas';
import userSagas from '../user/sagas';
import searchSagas from './search/sagas';
import breadcrumbSagas from './breadcrumb/loadBreadcrumbSaga';
import menuSagas from './menu/loadMenuSaga';
import displayConfigSagas from './displayConfig/loadDisplayConfigSaga';

export default function* () {
    yield fork(characteristicSaga);
    yield fork(datasetSaga);
    yield fork(exportSaga);
    yield fork(exportFieldsSaga);
    yield fork(fetchSaga);
    yield fork(i18nSaga);
    yield fork(fieldsSagas);
    yield fork(resourceSagas);
    yield fork(graphSagas);
    yield fork(userSagas);
    yield fork(searchSagas);
    yield fork(menuSagas);
    yield fork(breadcrumbSagas);
    yield fork(displayConfigSagas);
}
