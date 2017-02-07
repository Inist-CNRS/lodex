import { createAction } from 'redux-actions';

export const EXPORT_PUBLISHED_DATASET = 'EXPORT_PUBLISHED_DATASET';
export const EXPORT_PUBLISHED_DATASET_ERROR = 'EXPORT_PUBLISHED_DATASET_ERROR';
export const EXPORT_PUBLISHED_DATASET_SUCCESS = 'EXPORT_PUBLISHED_DATASET_SUCCESS';

export const exportPublishedDataset = createAction(EXPORT_PUBLISHED_DATASET);
export const exportPublishedDatasetError = createAction(EXPORT_PUBLISHED_DATASET_ERROR);
export const exportPublishedDatasetSuccess = createAction(EXPORT_PUBLISHED_DATASET_SUCCESS);

export const getExportPublishedDatasetRequest = () => ({
    url: '/api/export',
    headers: {
        Accept: 'text/csv',
        'Content-Type': 'application/json',
    },
});
