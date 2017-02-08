import { fork } from 'redux-saga/effects';

import datasetSaga from './dataset/sagas';
import exportSaga from './export/sagas';
import fetchSaga from './fetch/sagas';
import fieldsSaga from './admin/fields/sagas';
import i18nSaga from './i18n/sagas';
import parsingSaga from './admin/parsing/sagas';
import publicationPreviewSaga from './admin/publicationPreview/sagas';
import publicationSaga from './publication/sagas';
import publishSaga from './admin/publish/sagas';
import uploadFileSaga from './admin/upload/uploadFileSaga';
import userSaga from './user/sagas';
import resourceSagas from './resource/sagas';

export default function* () {
    yield fork(datasetSaga);
    yield fork(exportSaga);
    yield fork(fetchSaga);
    yield fork(fieldsSaga);
    yield fork(i18nSaga);
    yield fork(parsingSaga);
    yield fork(publicationPreviewSaga);
    yield fork(publicationSaga);
    yield fork(publishSaga);
    yield fork(uploadFileSaga);
    yield fork(userSaga);
    yield fork(resourceSagas);
}
