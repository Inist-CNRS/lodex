import { call, put, takeLatest } from 'redux-saga/effects';
import { setLanguage } from 'redux-polyglot';

import fetchSaga from '../../lib/sagas/fetchSaga';

import {
    SET_LANGUAGE_REQUEST,
    setLanguageSuccess,
    setLanguageError,
} from '../';

export function* loadPhrases(locale) {
    return yield call(fetchSaga, {
        url: `/api/translations/${locale}`,
        method: 'GET',
    });
}

export function* handleSetLanguage({ payload: language }) {
    try {
        const { response, error } = yield call(loadPhrases, language);
        if (error) {
            yield put(setLanguageError(error));
            return;
        }
        yield put(setLanguageSuccess(language));
        yield put(setLanguage(language, response));
    } catch (error) {
        yield put(setLanguageError(error));
    }
}

export default function* watchSetLanguage() {
    yield takeLatest(SET_LANGUAGE_REQUEST, handleSetLanguage);
}
