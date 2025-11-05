import { createGlobalSelectors } from '@lodex/frontend-common/utils/selectors';

import { selectors as importSelectors } from './import';
import { selectors as parsingSelectors } from './parsing';
import { selectors as publicationSelectors } from './publication';
import { selectors as publicationPreviewSelectors } from './preview/publication';
import { selectors as fieldPreviewSelectors } from './preview/field';
import { selectors as publishSelectors } from './publish';
import { selectors as removedResourcesSelectors } from './removedResources';
import { selectors as uploadSelectors } from './upload';
import { selectors as clearSelectors } from './clear';
import { selectors as progressSelectors } from './progress/reducer';
import { selectors as loaderSelectors } from './loader';
import { selectors as subresourcesSelectors } from './subresource';
import { selectors as enrichmentsSelectors } from './enrichment';
import { selectors as precomputedSelectors } from './precomputed';
import { selectors as dumpSelectors } from './dump';
import { selectors as configTenantSelectors } from './configTenant';
import type { State } from './reducers';

export const fromParsing = createGlobalSelectors<
    typeof parsingSelectors,
    State
>((s) => s.parsing, parsingSelectors);
export const fromPublication = createGlobalSelectors<
    typeof publicationSelectors,
    State
>((s) => s.publication, publicationSelectors);
export const fromPublicationPreview = createGlobalSelectors<
    typeof publicationPreviewSelectors,
    State
    // @ts-expect-error TS7034
>((s) => s.preview.publication, publicationPreviewSelectors);
export const fromFieldPreview = createGlobalSelectors(
    // @ts-expect-error TS7034
    (s) => s.preview.field,
    fieldPreviewSelectors,
);
export const fromPublish = createGlobalSelectors<
    typeof publishSelectors,
    State
>((s) => s.publish, publishSelectors);
export const fromRemovedResources = createGlobalSelectors<
    typeof removedResourcesSelectors,
    State
>((s) => s.removedResources, removedResourcesSelectors);

export const fromDump = createGlobalSelectors<typeof dumpSelectors, State>(
    (s) => s.dump,
    dumpSelectors,
);
export const fromUpload = createGlobalSelectors<typeof uploadSelectors, State>(
    (s) => s.upload,
    uploadSelectors,
);
export const fromImport = createGlobalSelectors<typeof importSelectors, State>(
    (s) => s.import,
    importSelectors,
);
export const fromClear = createGlobalSelectors<typeof clearSelectors, State>(
    (s) => s.clear,
    clearSelectors,
);

export const fromProgress = createGlobalSelectors<
    typeof progressSelectors,
    State
>((s) => s.progress, progressSelectors);
export const fromLoaders = createGlobalSelectors<typeof loaderSelectors, State>(
    (s) => s.loaders,
    loaderSelectors,
);

export const fromSubresources = createGlobalSelectors<
    typeof subresourcesSelectors,
    State
>((s) => s.subresource, subresourcesSelectors);

export const fromEnrichments = createGlobalSelectors<
    typeof enrichmentsSelectors,
    State
>((s) => s.enrichment, enrichmentsSelectors);

export const fromPrecomputed = createGlobalSelectors<
    typeof precomputedSelectors,
    State
>((s) => s.precomputed, precomputedSelectors);

export const fromConfigTenant = createGlobalSelectors<
    typeof configTenantSelectors,
    State
>((s) => s.configTenant, configTenantSelectors);
