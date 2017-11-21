import { fork } from 'redux-saga/effects';

import publicationPreview from './publication/sagas';
import fieldPreview from './field/sagas';

export default function*() {
    yield fork(publicationPreview);
    yield fork(fieldPreview);
}
