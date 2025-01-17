import { reducer as form } from 'redux-form';

import fetchReducer from '../fetch';
import fields from '../fields';
import i18n from '../i18n';
import importReducer from './import';
import parsing from './parsing';
import publication from './publication';
import preview from './preview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import user from '../user';
import clear from './clear';
import dump from './dump';
import characteristic from '../characteristic';
import progress from './progress/reducer';
import loaders from './loader';
import subresource from './subresource';
import enrichment from './enrichment';
import precomputed from './precomputed';
import configTenant from './configTenant';

const reducers = {
    fetch: fetchReducer,
    fields,
    form,
    i18n,
    import: importReducer,
    dump,
    parsing,
    publication,
    preview,
    publish: publishReducer,
    removedResources,
    upload,
    user,
    clear,
    characteristic,
    progress,
    loaders,
    subresource,
    enrichment,
    precomputed,
    configTenant,
};

export default reducers;
