import dataset from './dataset';
import exportReducer from './export';
import format from './formats/reducer';
import resource from './resource';
import searchReducer from './search/reducer';
import breadcrumb from './breadcrumb/reducer';
import menu from './menu/reducer';
import displayConfig from './displayConfig/reducer';
import configTenant from '../../admin-app/src/configTenant';
import sharedReducers from '@lodex/frontend-common/sharedReducers';

const reducers = {
    ...sharedReducers,
    dataset,
    export: exportReducer,
    resource,
    format,
    search: searchReducer,
    menu,
    breadcrumb,
    displayConfig,
    configTenant,
};

export default reducers;
