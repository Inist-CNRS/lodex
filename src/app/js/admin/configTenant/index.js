import { createAction, handleActions } from 'redux-actions';

export const LOAD_CONFIG_TENANT = 'LOAD_CONFIG_TENANT';
export const LOAD_CONFIG_TENANT_ERROR = 'LOAD_CONFIG_TENANT_ERROR';
export const LOAD_CONFIG_TENANT_SUCCESS = 'LOAD_CONFIG_TENANT_SUCCESS';

export const loadConfigTenant = createAction(LOAD_CONFIG_TENANT);
export const loadConfigTenantError = createAction(LOAD_CONFIG_TENANT_ERROR);
export const loadConfigTenantSuccess = createAction(LOAD_CONFIG_TENANT_SUCCESS);

export const initialState = {
    error: null,
    loading: false,
    configTenant: {},
};

export default handleActions(
    {
        LOAD_CONFIG_TENANT: (state) => ({ ...state, loading: true }),
        LOAD_CONFIG_TENANT_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        LOAD_CONFIG_TENANT_SUCCESS: (state, { payload: configTenant }) => ({
            ...state,
            configTenant,
            loading: false,
        }),
    },
    initialState,
);

export const isLoading = (state) => state.loading;
export const configTenant = (state) => state.configTenant;
export const isEnableAutoPublication = (state) =>
    state.configTenant?.enableAutoPublication;
export const getError = (state) => state.error;

export const selectors = {
    isLoading,
    getError,
    configTenant,
    isEnableAutoPublication,
};
