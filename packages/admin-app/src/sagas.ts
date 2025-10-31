import { fork } from 'redux-saga/effects';

import exportSaga from '@lodex/frontend-common/export-fields/sagas';
import importSaga from './import/sagas';
import fieldsSaga from '../../../src/app/js/fields/sagas';
import parsingSaga from './parsing/sagas';
import publicationSaga from './publication/sagas';
import previewSaga from './preview/sagas';
import publishSaga from './publish/sagas';
import removedResourcesSagas from './removedResources/sagas';
import uploadFileSaga from './upload/sagas';
import userSagas from '../../../src/app/js/user/sagas';
import fetchSaga from '@lodex/frontend-common/fetch/sagas';
import i18nSagas from '@lodex/frontend-common/i18n/sagas';
import clearSaga from './clear/sagas';
import progressSaga from './progress/sagas';
import characteristicSaga from '@lodex/frontend-common/characteristics/sagas';
import loaderSaga from './loader/sagas';
import subresourceSaga from './subresource/sagas';
import enrichmentSaga from './enrichment/sagas';
import precomputedSaga from './precomputed/sagas';
import dumpSaga from './dump/sagas';
import navigationSaga from './navigation/sagas';
import configTenantSaga from './configTenant/sagas';

export default function* () {
    yield fork(exportSaga);
    yield fork(fetchSaga);
    yield fork(fieldsSaga);
    yield fork(importSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(previewSaga);
    yield fork(publishSaga);
    yield fork(removedResourcesSagas);
    yield fork(uploadFileSaga);
    yield fork(userSagas);
    yield fork(i18nSagas);
    yield fork(clearSaga);
    yield fork(progressSaga);
    yield fork(characteristicSaga);
    yield fork(loaderSaga);
    yield fork(subresourceSaga);
    yield fork(enrichmentSaga);
    yield fork(precomputedSaga);
    yield fork(dumpSaga);
    yield fork(navigationSaga);
    yield fork(configTenantSaga);
}
