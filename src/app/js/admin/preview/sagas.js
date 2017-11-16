import { fork } from 'redux-saga/effects';

import publicationPreview from './publication/sagas';
import fieldPreview from './field/sagas';

export default [
    publicationPreview,
    fieldPreview,
];
