import characteristic from './characteristics/reducer';
import fetchReducer from './fetch/reducer';
import fields from './fields/reducer';
import i18n from './i18n';
import user from './user/reducer';

export default {
    characteristic,
    fetch: fetchReducer,
    i18n,
    fields,
    user,
};
