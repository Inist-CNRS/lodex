import characteristic from '@lodex/frontend-common/characteristics/reducer';
import dataset from './dataset';
import exportReducer from './export';
import fetchReducer from '@lodex/frontend-common/fetch/reducer';
import i18n from '@lodex/frontend-common/i18n';
import fields from '../../../src/app/js/fields/reducer';
import resource from './resource';
import format from '../../../src/app/js/formats/reducer';
import user from '../../../src/app/js/user/reducer';
import searchReducer from './search/reducer';
import breadcrumb from './breadcrumb/reducer';
import menu from './menu/reducer';
import displayConfig from './displayConfig/reducer';
import configTenant from '../../admin-app/src/configTenant';

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
