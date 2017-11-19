import { put, call, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'react-router-redux';

import { setLanguage } from '../';

const queryStringToLiteral = (queryString = '') =>
    queryString
        .slice(1)
        .split('&')
        .map(v => v.split('='))
        .reduce((acc, [key, value]) => ({
            ...acc,
            [key]: value,
        }), {});

const getLanguage = queryString => queryStringToLiteral(queryString).language;


export function* handleInitializeLanguage({ payload: { search } }) {
    const language = yield call(getLanguage, search);
    yield put(setLanguage(language));
}

export default function* watchInitializeLanguage() {
    yield takeEvery(LOCATION_CHANGE, handleInitializeLanguage);
}
