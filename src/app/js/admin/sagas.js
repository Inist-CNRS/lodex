import { fork } from 'redux-saga/effects';

import exportSaga from '../exportFields/sagas';
import exportReadySaga from '../exportFieldsReady/sagas';
import importSaga from './import/sagas';
import fieldsSaga from '../fields/sagas';
import parsingSaga from './parsing/sagas';
import publicationSaga from './publication/sagas';
import previewSaga from './preview/sagas';
import publishSaga from './publish/sagas';
import removedResourcesSagas from './removedResources/sagas';
import contributedResourcesSagas from './contributedResources/sagas';
import uploadFileSaga from './upload/sagas';
import userSagas from '../user/sagas';
import fetchSaga from '../fetch/sagas';
import i18nSagas from '../i18n/sagas';
import clearSaga from './clear/sagas';
import progressSaga from './progress/sagas';
import characteristicSaga from '../characteristic/sagas';

export default function*() {
    yield fork(exportSaga);
    yield fork(exportReadySaga);
    yield fork(fetchSaga);
    yield fork(fieldsSaga);
    yield fork(importSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(previewSaga);
    yield fork(publishSaga);
    yield fork(removedResourcesSagas);
    yield fork(contributedResourcesSagas);
    yield fork(uploadFileSaga);
    yield fork(userSagas);
    yield fork(i18nSagas);
    yield fork(clearSaga);
    yield fork(progressSaga);
    yield fork(characteristicSaga);
}
