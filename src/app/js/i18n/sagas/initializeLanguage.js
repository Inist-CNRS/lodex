import { put, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { setLanguage } from '../';


export function* handleInitializeLanguage({ payload: { query: { language = navigator.language } } }) {
    yield put(setLanguage(language));
}

export default function* watchInitializeLanguage() {
    yield takeEvery(LOCATION_CHANGE, handleInitializeLanguage);
}
