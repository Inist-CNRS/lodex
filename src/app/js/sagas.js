import { fork } from 'redux-saga/effects';

import userSaga from './user/sagas';
import parsingSaga from './admin/parsing/sagas';

export default function* () {
    yield fork(userSaga);
    yield fork(parsingSaga);
}
