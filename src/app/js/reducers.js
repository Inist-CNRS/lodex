import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import characteristic from './characteristic';
import dataset from './dataset';
import fetchReducer from './fetch';
import fields from './admin/fields';
import i18n from './i18n';
import parsing from './admin/parsing';
import publication from './publication';
import publicationPreview from './admin/publicationPreview';
import publishReducer from './admin/publish';
import removedResources from './admin/removedResources';
import resource from './resource';
import upload from './admin/upload';
import user from './user';
import validation from './admin/validation';

export const getCurrentLocation = state => state.routing;

const rootReducer = combineReducers({
    characteristic,
    dataset,
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    parsing,
    polyglot,
    publication,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    resource,
    routing,
    upload,
    user,
    validation,
});

export default rootReducer;
