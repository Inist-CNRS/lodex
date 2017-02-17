import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';

import fetchReducer from './fetch';
import fields from './admin/fields';
import i18n from './i18n';
import parsing from './admin/parsing';
import publicReducer from './public';
import publicationPreview from './admin/publicationPreview';
import publishReducer from './admin/publish';
import removedResources from './admin/removedResources';
import upload from './admin/upload';
import user from './user';
import validation from './admin/validation';

export const getCurrentLocation = state => state.routing;

const rootReducer = combineReducers({
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    parsing,
    polyglot,
    public: publicReducer,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    routing,
    upload,
    user,
    validation,
});

export default rootReducer;
