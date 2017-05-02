import { fork } from 'redux-saga/effects';

import uploadFile from './uploadFile';
import uploadUrl from './uploadUrl';

export default function* () {
    yield fork(uploadFile);
    yield fork(uploadUrl);
}
