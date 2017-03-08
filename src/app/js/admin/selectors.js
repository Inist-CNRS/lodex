import { createGlobalSelectors } from '../lib/selectors';

import { selectors as fieldsSelectors } from './fields';
import { selectors as importSelectors } from './import';
import { selectors as parsingSelectors } from './parsing';
import { selectors as publicationSelectors } from './publication';
import { selectors as publicationPreviewSelectors } from './publicationPreview';
import { selectors as publishSelectors } from './publish';
import { selectors as removedResourcesSelectors } from './removedResources';
import { selectors as uploadSelectors } from './upload';
import { selectors as contributedResourcesSelectors } from './contributedResources';

export const fromFields = createGlobalSelectors(s => s.fields, fieldsSelectors);
export const fromParsing = createGlobalSelectors(s => s.parsing, parsingSelectors);
export const fromPublication = createGlobalSelectors(s => s.publication, publicationSelectors);
export const fromPublicationPreview = createGlobalSelectors(
    s => s.publicationPreview,
    publicationPreviewSelectors,
);
export const fromPublish = createGlobalSelectors(s => s.publish, publishSelectors);
export const fromRemovedResources = createGlobalSelectors(s => s.removedResources, removedResourcesSelectors);
export const fromUpload = createGlobalSelectors(s => s.upload, uploadSelectors);
export const fromImport = createGlobalSelectors(s => s.import, importSelectors);
export const fromContributedResources =
    createGlobalSelectors(s => s.contributedResources, contributedResourcesSelectors);
