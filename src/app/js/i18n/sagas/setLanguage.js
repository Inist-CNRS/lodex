import { call, fork, put, takeLatest } from 'redux-saga/effects';
import { setLanguage } from 'redux-polyglot';

import {
    SET_LANGUAGE_REQUEST,
    SUPPORTED_LANGUAGES,
    setLanguageSuccess,
    setLanguageError,
} from '../';

export function loadPhrases(locale) {
    return import(`../translations/${locale}`).then(module => module.default());
}

export function* handleSetLanguage({ payload: language }) {
    try {
        if (!SUPPORTED_LANGUAGES.includes(language)) return;

        const phrases = yield call(loadPhrases, language);
        yield put(setLanguageSuccess(language));
        yield put(setLanguage(language, phrases));
    } catch (error) {
        yield put(setLanguageError(error));
    }
}

export function* watchSetLanguage() {
    yield takeLatest(SET_LANGUAGE_REQUEST, handleSetLanguage);
}

export default function*() {
    yield fork(watchSetLanguage);
}
