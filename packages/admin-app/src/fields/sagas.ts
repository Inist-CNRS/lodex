import { loadField } from '@lodex/frontend-common/fields/reducer';
import { fork } from 'redux-saga/effects';

export default function* () {
    yield fork(loadField);
}
