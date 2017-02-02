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
import publicationPreview from './admin/publicationPreview';

export const getCurrentLocation = state => state.routing;

const rootReducer = combineReducers({
    dataset,
    form,
    i18n,
    parsing,
    polyglot,
    publication,
    publish: publishReducer,
    routing,
    upload,
    user,
    fields,
    publicationPreview,
});

export default rootReducer;
