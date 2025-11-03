import { fork } from 'redux-saga/effects';

import sharedSagas from '@lodex/frontend-common/sharedSagas';

import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import resourceSagas from './resource/sagas';
import searchSagas from './search/sagas';
import breadcrumbSagas from './breadcrumb/loadBreadcrumbSaga';
import menuSagas from './menu/loadMenuSaga';
import displayConfigSagas from './displayConfig/loadDisplayConfigSaga';
import formatSagas from './formats/sagas';

export default function* () {
    yield fork(sharedSagas);
    yield fork(datasetSaga);
    yield fork(exportSaga);
    yield fork(resourceSagas);
    yield fork(searchSagas);
    yield fork(menuSagas);
    yield fork(breadcrumbSagas);
    yield fork(displayConfigSagas);
    yield fork(formatSagas);
}
