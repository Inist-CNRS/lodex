import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';
import { reducer as tooltip } from 'redux-tooltip';

import characteristic from '../characteristic';
import dataset from './dataset';
import exportReducer from './export';
import facet from './facet';
import fetchReducer from '../fetch';
import i18n from '../i18n';
import fields from '../fields';
import resource from './resource';
import format from '../formats/reducer';
import user from '../user';

const rootReducer = combineReducers({
    characteristic,
    dataset,
    export: exportReducer,
    facet,
    fetch: fetchReducer,
    form,
    i18n,
    polyglot,
    fields,
    resource,
    format,
    user,
    tooltip,
});

export default rootReducer;
