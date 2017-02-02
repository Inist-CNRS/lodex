import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import dataset from './dataset';
import i18n from './i18n';
import user from './user';
import parsing from './admin/parsing';
import publication from './publication';
import publishReducer from './admin/publish';
import upload from './admin/upload';
import fields from './admin/fields';
import fetchReducer from './fetch';
import publicationPreview from './admin/publicationPreview';

export const getCurrentLocation = state => state.routing;

const rootReducer = combineReducers({
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
    routing,
    upload,
    user,
});

export default rootReducer;
