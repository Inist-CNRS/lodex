import fetchReducer, {
    type FetchState,
} from '@lodex/frontend-common/fetch/reducer';
import fields from '../../../src/app/js/fields/reducer';
import i18n from '@lodex/frontend-common/i18n';
import importReducer from './import';
import parsing from './parsing';
import publication from './publication';
import preview from './preview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import user from '../../../src/app/js/user/reducer';
import clear from './clear';
import dump from './dump';
import characteristic from '../../../src/app/js/characteristic/reducer';
import progress from './progress/reducer';
import loaders from './loader';
import subresource, { type SubresourceState } from './subresource';
import enrichment from './enrichment';
import precomputed, { type PrecomputedState } from './precomputed';
import configTenant from './configTenant';

export type State = {
    fetch: FetchState;
    fields: unknown;
    form: unknown;
    i18n: unknown;
    import: unknown;
    dump: unknown;
    parsing: unknown;
    publication: unknown;
    preview: unknown;
    publish: unknown;
    removedResources: unknown;
    upload: unknown;
    user: unknown;
    clear: unknown;
    characteristic: unknown;
    progress: unknown;
    loaders: unknown;
    subresource: SubresourceState;
    enrichment: unknown;
    precomputed: PrecomputedState;
    configTenant: unknown;
};

const reducers = {
    fetch: fetchReducer,
    fields,
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
