import characteristic from '@lodex/frontend-common/characteristics/reducer';
import fetchReducer from '@lodex/frontend-common/fetch/reducer';
import fields from '@lodex/frontend-common/fields/reducer';
import format from './formats/reducer';
import i18n from '@lodex/frontend-common/i18n';
import user from '@lodex/frontend-common/user/reducer';

import dataset from './dataset';
import exportReducer from './export';
import resource from './resource';
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
