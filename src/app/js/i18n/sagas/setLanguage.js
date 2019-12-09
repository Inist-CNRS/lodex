import { call, put, takeLatest } from 'redux-saga/effects';
import { setLanguage } from 'redux-polyglot';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    SET_LANGUAGE_REQUEST,
    setLanguageSuccess,
    setLanguageError,
} from '../';

export function* loadPhrases(locale) {
    const { response, error } = yield call(fetchSaga, {
        url: `/api/translations/${locale}`,
        method: 'GET',
    });

    if (error) {
        throw new Error(error);
    }

    return response;
}

export function* handleSetLanguage({ payload: language }) {
    try {
        const phrases = yield call(loadPhrases, language);

        yield put(setLanguageSuccess(language));
        yield put(setLanguage(language, phrases));
    } catch (error) {
        yield put(setLanguageError(error));
    }
}

export default function* watchSetLanguage() {
    yield takeLatest(SET_LANGUAGE_REQUEST, handleSetLanguage);
}
