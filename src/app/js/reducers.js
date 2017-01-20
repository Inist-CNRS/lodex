import { combineReducers } from 'redux';
import { routerReducer as routing } from 'react-router-redux';
import { reducer as form } from 'redux-form';
import user from './user';
import parsing from './admin/parsing';

const rootReducer = combineReducers({
    form,
    routing,
    user,
    parsing,
});

export default rootReducer;
