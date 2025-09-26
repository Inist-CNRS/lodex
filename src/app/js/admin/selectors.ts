import { createGlobalSelectors } from '../lib/selectors';

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

export const fromParsing = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.parsing,
    parsingSelectors,
);
export const fromPublication = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.publication,
    publicationSelectors,
);
export const fromPublicationPreview = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.preview.publication,
    publicationPreviewSelectors,
);
export const fromFieldPreview = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.preview.field,
    fieldPreviewSelectors,
);
export const fromPublish = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.publish,
    publishSelectors,
);
export const fromRemovedResources = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.removedResources,
    removedResourcesSelectors,
);

// @ts-expect-error TS7006
export const fromDump = createGlobalSelectors((s) => s.dump, dumpSelectors);
export const fromUpload = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.upload,
    uploadSelectors,
);
export const fromImport = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.import,
    importSelectors,
);
// @ts-expect-error TS7006
export const fromClear = createGlobalSelectors((s) => s.clear, clearSelectors);

export const fromProgress = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.progress,
    progressSelectors,
);
export const fromLoaders = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.loaders,
    loaderSelectors,
);

export const fromSubresources = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.subresource,
    subresourcesSelectors,
);

export const fromEnrichments = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.enrichment,
    enrichmentsSelectors,
);

export const fromPrecomputed = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.precomputed,
    precomputedSelectors,
);

export const fromConfigTenant = createGlobalSelectors(
    // @ts-expect-error TS7006
    (s) => s.configTenant,
    configTenantSelectors,
);
