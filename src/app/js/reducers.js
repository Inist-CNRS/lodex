import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import admin from './admin';
import fetchReducer from './fetch';
import i18n from './i18n';
import publicReducer from './public';
import user from './user';

export const getCurrentLocation = state => state.routing;

const rootReducer = combineReducers({
    admin,
    fetch: fetchReducer,
    form,
    i18n,
    polyglot,
    public: publicReducer,
    routing,
    user,
});

export default rootReducer;
