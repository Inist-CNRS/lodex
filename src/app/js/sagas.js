import { fork } from 'redux-saga/effects';

import adminSaga from './admin/sagas';
import exportSaga from './export/sagas';
import fetchSaga from './fetch/sagas';
import i18nSaga from './i18n/sagas';
import publicSaga from './public/sagas';
import userSaga from './user/sagas';

export default function* () {
    yield fork(adminSaga);
    yield fork(exportSaga);
    yield fork(fetchSaga);
    yield fork(i18nSaga);
    yield fork(publicSaga);
    yield fork(userSaga);
}
