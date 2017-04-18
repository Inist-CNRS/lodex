import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import fetchReducer from '../fetch';
import fields from './fields';
import i18n from '../i18n';
import importReducer from './import';
import parsing from './parsing';
import publication from './publication';
import publicationPreview from './preview/publication';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import user from '../user';
import debugReducer from '../lib/debugReducer';
import contributedResources from './contributedResources';

const reducer = combineReducers({
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    import: importReducer,
    polyglot,
    parsing,
    publication,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    routing,
    upload,
    user,
    contributedResources,
});

export default __DEBUG__ ?
    debugReducer(reducer)
    :
    reducer;
