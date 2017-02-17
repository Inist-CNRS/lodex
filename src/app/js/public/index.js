import { combineReducers } from 'redux';

import publication from './publication';
import dataset from './dataset';
import characteristic from './characteristic';
import resource from './resource';

const rootReducer = combineReducers({
    publication,
    dataset,
    characteristic,
    resource,
});

export default rootReducer;
