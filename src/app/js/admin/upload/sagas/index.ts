import { fork } from 'redux-saga/effects';

import uploadFile from './uploadFile';
import uploadUrl from './uploadUrl';
import uploadText from './uploadText';

export default function* () {
    yield fork(uploadFile);
    yield fork(uploadUrl);
    yield fork(uploadText);
}
