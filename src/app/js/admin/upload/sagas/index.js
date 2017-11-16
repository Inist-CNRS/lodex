import { fork } from 'redux-saga/effects';

import uploadFile from './uploadFile';
import uploadUrl from './uploadUrl';

export default [
    uploadFile,
    uploadUrl,
];
