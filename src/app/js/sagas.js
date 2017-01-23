import { fork } from 'redux-saga/effects';

import i18nSaga from './i18n/sagas';
import userSaga from './user/sagas';
import parsingSaga from './admin/parsing/sagas';

export default function* () {
    yield fork(i18nSaga);
    yield fork(userSaga);
    yield fork(parsingSaga);
}
