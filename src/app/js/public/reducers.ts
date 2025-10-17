import characteristic from '../characteristic';
import dataset from './dataset';
import exportReducer from './export';
import fetchReducer from '../fetch';
import i18n from '../i18n';
import fields from '../fields';
import resource from './resource';
import format from '../formats/reducer';
import user from '../user';
import searchReducer from './search/reducer';
import breadcrumb from './breadcrumb/reducer';
import menu from './menu/reducer';
import displayConfig from './displayConfig/reducer';
import configTenant from '../admin/configTenant';

const reducers = {
    characteristic,
    dataset,
    export: exportReducer,
    fetch: fetchReducer,
    i18n,
    fields,
    resource,
    format,
    user,
    search: searchReducer,
    menu,
    breadcrumb,
    displayConfig,
    configTenant,
};

export default reducers;
