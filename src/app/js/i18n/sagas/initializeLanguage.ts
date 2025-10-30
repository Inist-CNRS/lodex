import { put, takeEvery } from 'redux-saga/effects';

import { INITIALIZE_LANGUAGE, setLanguage } from '../';
import { getLocale } from '@lodex/common';

export function* handleInitializeLanguage() {
    const locale = getLocale();
    yield put(setLanguage(locale));
}

export default function* watchInitializeLanguage() {
    yield takeEvery(INITIALIZE_LANGUAGE, handleInitializeLanguage);
}
