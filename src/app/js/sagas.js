import { fork } from 'redux-saga/effects';

import datasetSaga from './dataset/sagas';
import i18nSaga from './i18n/sagas';
import userSaga from './user/sagas';
import parsingSaga from './admin/parsing/sagas';
import publicationSaga from './publication/sagas';
import publishSaga from './admin/publish/sagas';
import uploadFileSaga from './admin/upload/uploadFileSaga';
import fieldsSaga from './admin/fields/sagas';
import publicationPreviewSaga from './admin/publicationPreview/sagas';
import saveFieldSaga from './admin/fields/saveFieldSaga';

export default function* () {
    yield fork(datasetSaga);
    yield fork(i18nSaga);
    yield fork(userSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(publishSaga);
    yield fork(uploadFileSaga);
    yield fork(fieldsSaga);
    yield fork(saveFieldSaga);
    yield fork(publicationPreviewSaga);
}
