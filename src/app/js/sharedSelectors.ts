import get from 'lodash/get';

import { createGlobalSelectors } from '@lodex/frontend-common/utils/selectors';
import { selectors as fieldsSelectors } from './fields/reducer';
import { selectors as userSelectors } from './user/reducer';
import { selectors as characteristicSelectors } from '@lodex/frontend-common/characteristics/reducer';

export const fromCharacteristic = createGlobalSelectors(
    (s) => s.characteristic,
    characteristicSelectors,
);

export const fromFields = createGlobalSelectors(
    (s) => s.fields,
    fieldsSelectors,
);
// @ts-expect-error TS7006
export const fromUser = createGlobalSelectors((s) => s.user, userSelectors);

// @ts-expect-error TS7006
export const getCurrentLocation = (state) =>
    get(state, 'router.location.pathname');

// @ts-expect-error TS7006
export const getCurrentSearch = (state) => get(state, 'router.location.search');

// @ts-expect-error TS7006
export const getCurrentQuery = (state) => {
    const search = getCurrentSearch(state);
    const location = getCurrentLocation(state);

    return search ? `${location}${search}` : location;
};
