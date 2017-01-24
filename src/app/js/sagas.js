import { fork } from 'redux-saga/effects';

import userSaga from './user/sagas';

export default function* () {
    yield fork(userSaga);
}
