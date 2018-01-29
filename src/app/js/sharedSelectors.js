import get from 'lodash.get';

import { createGlobalSelectors } from './lib/selectors';
import { selectors as fieldsSelectors } from './fields';
import { selectors as userSelectors } from './user';
import { selectors as characteristicSelectors } from './characteristic';

export const fromCharacteristic = createGlobalSelectors(
    s => s.characteristic,
    characteristicSelectors,
);

export const fromFields = createGlobalSelectors(s => s.fields, fieldsSelectors);
export const fromUser = createGlobalSelectors(s => s.user, userSelectors);

export const getCurrentLocation = state =>
    get(state, 'routing.locationBeforeTransitions.pathname');
