import { fork } from 'redux-saga/effects';

import characteristicSaga from '@lodex/frontend-common/characteristics/sagas';
import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import exportFieldsSaga from '@lodex/frontend-common/export-fields/sagas';
import fetchSaga from '@lodex/frontend-common/fetch/sagas';
import i18nSaga from '@lodex/frontend-common/i18n/sagas';
import fieldsSagas from '@lodex/frontend-common/fields/sagas';
import resourceSagas from './resource/sagas';
import graphSagas from '../../../src/app/js/formats/sagas';
import userSagas from '../../../src/app/js/user/sagas';
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
