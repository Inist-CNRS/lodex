import { combineReducers } from 'redux';

import fields from './fields';
import parsing from './parsing';
import publication from './publication';
import publicationPreview from './publicationPreview';
import publishReducer from './publish';
import removedResources from './removedResources';
import upload from './upload';

export default combineReducers({
    fields,
    parsing,
    publication,
    publicationPreview,
    publish: publishReducer,
    removedResources,
    upload,
});
