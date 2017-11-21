import { put, call, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';
import qs from 'qs';

import { setLanguage } from '../';

const getLanguage = queryString =>
    qs.parse(queryString, { ignorePrefix: true }).language;

export function* handleInitializeLanguage({ payload: { search } }) {
    const language = yield call(getLanguage, search);
    yield put(setLanguage(language));
}

export default function* watchInitializeLanguage() {
    yield takeEvery(LOCATION_CHANGE, handleInitializeLanguage);
}
