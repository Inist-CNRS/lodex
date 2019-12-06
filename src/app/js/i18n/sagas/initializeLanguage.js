import { put, call, takeEvery } from 'redux-saga/effects';
import { LOCATION_CHANGE } from 'connected-react-router';
import qs from 'qs';

import { setLanguage } from '../';
import getLocale from '../../../../common/getLocale';

const getLanguage = queryString => {
    const locale = qs.parse(queryString, { ignorePrefix: true }).language;
    if (!locale) {
        return getLocale();
    }
    return locale;
};

export function* handleInitializeLanguage({ payload: { search } }) {
    const language = yield call(getLanguage, search);
    yield put(setLanguage(language));
}

export default function* watchInitializeLanguage() {
    yield takeEvery(LOCATION_CHANGE, handleInitializeLanguage);
}
