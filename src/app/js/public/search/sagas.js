import { put, takeEvery } from 'redux-saga/effects';

import { SEARCH, searchSucceed } from './';

const handleSearch = function*() {
    yield put(searchSucceed());
};

export default function*() {
    yield takeEvery(SEARCH, handleSearch);
}
