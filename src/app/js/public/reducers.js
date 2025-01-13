import { combineReducers } from 'redux';
import { reducer as form } from 'redux-form';
import { polyglotReducer as polyglot } from 'redux-polyglot';
import { connectRouter } from 'connected-react-router';

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

const rootReducer = (history) =>
    combineReducers({
        characteristic,
        dataset,
        export: exportReducer,
        fetch: fetchReducer,
        form,
        i18n,
        polyglot,
        fields,
        resource,
        format,
        user,
        search: searchReducer,
        menu,
        breadcrumb,
        displayConfig,
        configTenant,
        router: connectRouter(history),
    });

export default rootReducer;
