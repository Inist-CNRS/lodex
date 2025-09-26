import { combineReducers } from 'redux';

import publication from './publication';
import field from './field';

export default combineReducers({
    publication,
    field,
});
