import get from 'lodash/get';

import { createGlobalSelectors } from './utils/selectors';
import { selectors as fieldsSelectors } from './fields/reducer';
import { selectors as userSelectors } from './user/reducer';
import { selectors as characteristicSelectors } from './characteristics/reducer';
import { fromFormat as localFromFormat } from './formats/reducer';
import { fromI18n as localFromI18n } from './i18n';

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

// @ts-expect-error TS7006
const getFormatState = (state) => state.format;
export const fromFormat = createGlobalSelectors(
    getFormatState,
    localFromFormat,
);

// @ts-expect-error TS7006
const getI18nState = (state) => state.i18n;
export const fromI18n = createGlobalSelectors(getI18nState, localFromI18n);
