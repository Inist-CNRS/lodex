import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import characteristic from './characteristic';
import dataset from './dataset';
import exportReducer from './export';
import facet from './facet';
import fetchReducer from '../fetch';
import i18n from '../i18n';
import publication from './publication';
import resource from './resource';
import user from '../user';
import debugReducer from '../lib/debugReducer';

const rootReducer = combineReducers({
    characteristic,
    dataset,
    export: exportReducer,
    facet,
    fetch: fetchReducer,
    form,
    i18n,
    polyglot,
    publication,
    resource,
    routing,
    user,
});

export default __DEBUG__ ? debugReducer(rootReducer) : rootReducer;
