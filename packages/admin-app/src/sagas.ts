import { fork } from 'redux-saga/effects';

import sharedSagas from '@lodex/frontend-common/sharedSagas';

import importSaga from './import/sagas';
import parsingSaga from './parsing/sagas';
import publicationSaga from './publication/sagas';
import previewSaga from './preview/sagas';
import publishSaga from './publish/sagas';
import removedResourcesSagas from './removedResources/sagas';
import uploadFileSaga from './upload/sagas';
import clearSaga from './clear/sagas';
import progressSaga from './progress/sagas';
import loaderSaga from './loader/sagas';
import subresourceSaga from './subresource/sagas';
import enrichmentSaga from './enrichment/sagas';
import precomputedSaga from './precomputed/sagas';
import dumpSaga from './dump/sagas';
import navigationSaga from './navigation/sagas';
import configTenantSaga from './configTenant/sagas';
import fieldsSaga from './fields/sagas';

export default function* () {
    yield fork(sharedSagas);
    yield fork(fieldsSaga);
    yield fork(importSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(previewSaga);
    yield fork(publishSaga);
    yield fork(removedResourcesSagas);
    yield fork(uploadFileSaga);
    yield fork(clearSaga);
    yield fork(progressSaga);
    yield fork(loaderSaga);
    yield fork(subresourceSaga);
    yield fork(enrichmentSaga);
    yield fork(precomputedSaga);
    yield fork(dumpSaga);
    yield fork(navigationSaga);
    yield fork(configTenantSaga);
}
