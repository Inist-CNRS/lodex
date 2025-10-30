import { call, put, takeLatest } from 'redux-saga/effects';

import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';

import {
    SET_LANGUAGE_REQUEST,
    setLanguageSuccess,
    setLanguageError,
} from '../';

// @ts-expect-error TS7006
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

// @ts-expect-error TS7031
export function* handleSetLanguage({ payload: locale }) {
    try {
        // @ts-expect-error TS7057
        const phrases = yield call(loadPhrases, locale);

        yield put(setLanguageSuccess({ locale, phrases }));
    } catch (error) {
        yield put(setLanguageError(error));
    }
}

export default function* watchSetLanguage() {
    // @ts-expect-error TS2769
    yield takeLatest(SET_LANGUAGE_REQUEST, handleSetLanguage);
}
