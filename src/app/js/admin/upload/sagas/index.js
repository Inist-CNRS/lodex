import { fork } from 'redux-saga/effects';

import uploadFile from './uploadFile';
import uploadUrl from './uploadUrl';
import cancelUpload from './cancelUpload';

export default function*() {
    yield fork(uploadFile);
    yield fork(uploadUrl);
    yield fork(cancelUpload);
}
