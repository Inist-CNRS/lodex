import characteristic from './characteristics/reducer';
import fetchReducer from './fetch/reducer';
import fields from './fields/reducer';
import i18n from './i18n';
import user from './user/reducer';

export type SharedState = {
    characteristic: ReturnType<typeof characteristic>;
    fetch: ReturnType<typeof fetchReducer>;
    i18n: ReturnType<typeof i18n>;
    fields: ReturnType<typeof fields>;
    user: ReturnType<typeof user>;
};

export default {
    characteristic,
    fetch: fetchReducer,
    i18n,
    fields,
    user,
};
