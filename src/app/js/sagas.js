import { fork } from 'redux-saga/effects';

import userSaga from './signIn/sagas';

export default function* () {
    yield fork(userSaga);
}
