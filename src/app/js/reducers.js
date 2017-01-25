import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';
import dataset from './dataset';
import i18n from './i18n';
import user from './user';
import parsing from './admin/parsing';
import publication from './publication';
import publish from './admin/publish';
import upload from './admin/upload';

const rootReducer = combineReducers({
    dataset,
    form,
    i18n,
    parsing,
    polyglot,
    publication,
    publish,
    routing,
    upload,
    user,
});

export default rootReducer;
