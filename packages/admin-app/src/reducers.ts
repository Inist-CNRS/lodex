import { type FetchState } from '@lodex/frontend-common/fetch/reducer';

import importReducer from './import';
import parsing from './parsing';
import publication from './publication';
import preview from './preview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';
import clear from './clear';
import dump from './dump';
import progress from './progress/reducer';
import loaders from './loader';
import subresource, { type SubresourceState } from './subresource';
import enrichment from './enrichment';
import precomputed, { type PrecomputedState } from './precomputed';
import configTenant from './configTenant';
import sharedReducers, {
    type SharedState,
} from '@lodex/frontend-common/sharedReducers';

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
    format: unknown;
} & SharedState;

const reducers = {
    ...sharedReducers,
    import: importReducer,
    dump,
    parsing,
    publication,
    preview,
    publish: publishReducer,
    removedResources,
    upload,
    clear,
    progress,
    loaders,
    subresource,
    enrichment,
    precomputed,
    configTenant,
};

export default reducers;
