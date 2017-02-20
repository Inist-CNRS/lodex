import { fork } from 'redux-saga/effects';

import fieldsSaga from './fields/sagas';
import parsingSaga from './parsing/sagas';
import publicationSaga from './publication/sagas';
import publicationPreviewSaga from './publicationPreview/sagas';
import publishSaga from './publish/sagas';
import removedResourcesSagas from './removedResources/sagas';
import uploadFileSaga from './upload/sagas';

export default function* () {
    yield fork(fieldsSaga);
    yield fork(parsingSaga);
    yield fork(publicationSaga);
    yield fork(publicationPreviewSaga);
    yield fork(publishSaga);
    yield fork(removedResourcesSagas);
    yield fork(uploadFileSaga);
}
