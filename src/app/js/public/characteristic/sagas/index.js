import { fork } from 'redux-saga/effects';

import updateCharacteristic from './updateCharacteristic';
import addCharacteristic from './addCharacteristic';

export default function* () {
    yield fork(updateCharacteristic);
    yield fork(addCharacteristic);
}
