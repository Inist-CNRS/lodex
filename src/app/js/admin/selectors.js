import { createGlobalSelectors } from '../selectors';

import { selectors as fieldsSelectors } from './fields';
import { selectors as parsingSelectors } from './parsing';
import { selectors as publicationSelectors } from './publication';
import { selectors as publicationPreviewSelectors } from './publicationPreview';
import { selectors as publishSelectors } from './publish';
import { selectors as removedResourcesSelectors } from './removedResources';
import { selectors as uploadSelectors } from './upload';

export const fromFields = createGlobalSelectors(s => s.admin.fields, fieldsSelectors);
export const fromParsing = createGlobalSelectors(s => s.admin.parsing, parsingSelectors);
export const fromPublication = createGlobalSelectors(s => s.admin.publication, publicationSelectors);
export const fromPublicationPreview = createGlobalSelectors(
    s => s.admin.publicationPreview,
    publicationPreviewSelectors,
);
export const fromPublish = createGlobalSelectors(s => s.admin.publish, publishSelectors);
export const fromRemovedResources = createGlobalSelectors(s => s.admin.removedResources, removedResourcesSelectors);
export const fromUpload = createGlobalSelectors(s => s.admin.upload, uploadSelectors);
