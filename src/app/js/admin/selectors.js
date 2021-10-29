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
import { selectors as dumpSelectors } from './dump';

export const fromParsing = createGlobalSelectors(
    s => s.parsing,
    parsingSelectors,
);
export const fromPublication = createGlobalSelectors(
    s => s.publication,
    publicationSelectors,
);
export const fromPublicationPreview = createGlobalSelectors(
    s => s.preview.publication,
    publicationPreviewSelectors,
);
export const fromFieldPreview = createGlobalSelectors(
    s => s.preview.field,
    fieldPreviewSelectors,
);
export const fromPublish = createGlobalSelectors(
    s => s.publish,
    publishSelectors,
);
export const fromRemovedResources = createGlobalSelectors(
    s => s.removedResources,
    removedResourcesSelectors,
);

export const fromDump = createGlobalSelectors(s => s.dump, dumpSelectors);
export const fromUpload = createGlobalSelectors(s => s.upload, uploadSelectors);
export const fromImport = createGlobalSelectors(s => s.import, importSelectors);
export const fromClear = createGlobalSelectors(s => s.clear, clearSelectors);

export const fromProgress = createGlobalSelectors(
    s => s.progress,
    progressSelectors,
);
export const fromLoaders = createGlobalSelectors(
    s => s.loaders,
    loaderSelectors,
);

export const fromSubresources = createGlobalSelectors(
    s => s.subresource,
    subresourcesSelectors,
);

export const fromEnrichments = createGlobalSelectors(
    s => s.enrichment,
    enrichmentsSelectors,
);
