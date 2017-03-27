import { fork } from 'redux-saga/effects';

import updateCharacteristic from './updateCharacteristic';

export default function* () {
    yield fork(updateCharacteristic);
}
