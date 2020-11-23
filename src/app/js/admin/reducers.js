import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import fetchReducer from '../fetch';
import fields from '../fields';
import i18n from '../i18n';
import importReducer from './import';
import parsing from './parsing';
import publication from './publication';
import preview from './preview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import user from '../user';
import clear from './clear';
import characteristic from '../characteristic';
import progress from './progress/reducer';
import loaders from './loader';
import subresource from './subresource';

const reducer = combineReducers({
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    import: importReducer,
    polyglot,
    parsing,
    publication,
    preview,
    publish: publishReducer,
    removedResources,
    upload,
    user,
    clear,
    characteristic,
    progress,
    loaders,
    subresource,
});

export default reducer;
