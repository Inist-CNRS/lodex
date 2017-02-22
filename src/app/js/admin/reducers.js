import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import fetchReducer from '../fetch';
import fields from './fields';
import i18n from '../i18n';
import parsing from './parsing';
import publication from './publication';
import publicationPreview from './publicationPreview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import user from '../user';

export default combineReducers({
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    polyglot,
    parsing,
    publication,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    routing,
    upload,
    user,
});
