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
    get(state, 'router.location.pathname');

export const getCurrentSearch = state => get(state, 'router.location.search');

export const getCurrentQuery = state => {
    const search = getCurrentSearch(state);
    const location = getCurrentLocation(state);

    return search ? `${location}${search}` : location;
};
