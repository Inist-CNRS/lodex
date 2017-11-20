import { fork, all } from 'redux-saga/effects';

import exportSaga from '../exportFields/sagas';
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

export default function* () {
    yield fork(exportSaga);
    yield fork(fetchSaga);
    yield all(fieldsSaga.map(fork));
    yield fork(importSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield all(previewSaga.map(fork));
    yield fork(publishSaga);
    yield all(removedResourcesSagas.map(fork));
    yield fork(contributedResourcesSagas);
    yield all(uploadFileSaga.map(fork));
    yield fork(userSagas);
    yield all(i18nSagas.map(fork));
    yield fork(clearSaga);
}
