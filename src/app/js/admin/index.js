import { combineReducers } from 'redux';
import { createGlobalSelectors } from '../selectors';

import fields, { selectors as fieldsSelectors } from './fields';
import parsing, { selectors as parsingSelectors } from './parsing';
import publication, { selectors as publicationSelectors } from './publication';
import publicationPreview, { selectors as publicationPreviewSelectors } from './publicationPreview';
import publishReducer, { selectors as publishSelectors } from './publish';
import removedResources, { selectors as removedResourcesSelectors } from './removedResources';
import upload, { selectors as uploadSelectors } from './upload';

export default combineReducers({
    fields,
    parsing,
    publication,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    upload,
});

export const fromFields = createGlobalSelectors(s => s.admin.fields, fieldsSelectors);
export const fromParsing = createGlobalSelectors(s => s.admin.parsing, parsingSelectors);
export const fromPublication = createGlobalSelectors(s => s.admin.publication, publicationSelectors);
export const fromPublicationPreview = createGlobalSelectors(s => s.admin.publicationPreview, publicationPreviewSelectors);
export const fromPublish = createGlobalSelectors(s => s.admin.publish, publishSelectors);
export const fromRemovedResources = createGlobalSelectors(s => s.admin.removedResources, removedResourcesSelectors);
export const fromUpload = createGlobalSelectors(s => s.admin.upload, uploadSelectors);
