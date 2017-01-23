import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';
import i18n from './i18n';
import user from './user';
import parsing from './admin/parsing';

const rootReducer = combineReducers({
    form,
    i18n,
    parsing,
    polyglot,
    routing,
    user,
});

export default rootReducer;
