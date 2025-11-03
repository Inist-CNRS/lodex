import exportSaga from './export-fields/sagas';
import fieldsSaga from './fields/sagas';
import characteristicSaga from './characteristics/sagas';
import userSagas from './user/sagas';
import fetchSaga from './fetch/sagas';
import i18nSagas from './i18n/sagas';
import { fork } from 'redux-saga/effects';

export default function* () {
    yield fork(exportSaga);
    yield fork(fetchSaga);
    yield fork(fieldsSaga);
    yield fork(userSagas);
    yield fork(i18nSagas);
    yield fork(characteristicSaga);
}
