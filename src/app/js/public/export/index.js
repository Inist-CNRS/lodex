import { createAction, handleActions } from 'redux-actions';

export const PRE_LOAD_EXPORTERS = 'PRE_LOAD_EXPORTERS';
export const LOAD_EXPORTERS = 'LOAD_EXPORTERS';
export const LOAD_EXPORTERS_ERROR = 'LOAD_EXPORTERS_ERROR';
export const LOAD_EXPORTERS_SUCCESS = 'LOAD_EXPORTERS_SUCCESS';

export const EXPORT_PUBLISHED_DATASET = 'EXPORT_PUBLISHED_DATASET';
export const EXPORT_PUBLISHED_DATASET_ERROR = 'EXPORT_PUBLISHED_DATASET_ERROR';
export const EXPORT_PUBLISHED_DATASET_SUCCESS =
    'EXPORT_PUBLISHED_DATASET_SUCCESS';

export const exportPublishedDataset = createAction(EXPORT_PUBLISHED_DATASET);
export const exportPublishedDatasetError = createAction(
    EXPORT_PUBLISHED_DATASET_ERROR,
);
export const exportPublishedDatasetSuccess = createAction(
    EXPORT_PUBLISHED_DATASET_SUCCESS,
);

export const preLoadExporters = createAction(PRE_LOAD_EXPORTERS);
export const loadExporters = createAction(LOAD_EXPORTERS);
export const loadExportersError = createAction(LOAD_EXPORTERS_ERROR);
export const loadExportersSuccess = createAction(LOAD_EXPORTERS_SUCCESS);

const initialState = {
    error: false,
    loading: false,
    exporters: [],
};

export default handleActions(
    {
        [LOAD_EXPORTERS]: state => ({
            ...state,
            error: false,
            loading: true,
        }),
        [LOAD_EXPORTERS_ERROR]: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        [LOAD_EXPORTERS_SUCCESS]: (state, { payload: exporters }) => ({
            ...state,
            error: false,
            exporters,
            loading: false,
        }),
    },
    initialState,
);

export const getExporters = state =>
    state.exporters.filter(e => e.type === 'file');
export const getWidgets = state =>
    state.exporters.filter(e => e.type === 'widget');
export const areExporterLoaded = state => state.exporters.length > 0;

export const fromExport = {
    getExporters,
    getWidgets,
    areExporterLoaded,
};
