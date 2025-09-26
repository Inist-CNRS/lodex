// @ts-expect-error TS7016
import { createAction, handleActions } from 'redux-actions';

export const LOAD_CONFIG_TENANT = 'LOAD_CONFIG_TENANT';
export const LOAD_CONFIG_TENANT_ERROR = 'LOAD_CONFIG_TENANT_ERROR';
export const LOAD_CONFIG_TENANT_SUCCESS = 'LOAD_CONFIG_TENANT_SUCCESS';

export const loadConfigTenant = createAction(LOAD_CONFIG_TENANT);
export const loadConfigTenantError = createAction(LOAD_CONFIG_TENANT_ERROR);
export const loadConfigTenantSuccess = createAction(LOAD_CONFIG_TENANT_SUCCESS);

export const initialState = {
    error: null,
    initialized: false,
    loading: false,
    configTenant: {},
};

export default handleActions(
    {
        // @ts-expect-error TS7006
        LOAD_CONFIG_TENANT: (state) => ({
            ...state,
            loading: true,
            initialized: true,
        }),
        // @ts-expect-error TS7006
        LOAD_CONFIG_TENANT_ERROR: (state, { payload: error }) => ({
            ...state,
            error,
            loading: false,
        }),
        // @ts-expect-error TS7006
        LOAD_CONFIG_TENANT_SUCCESS: (state, { payload: configTenant }) => ({
            ...state,
            configTenant,
            loading: false,
        }),
    },
    initialState,
);

// @ts-expect-error TS7006
export const isLoading = (state) => state.loading;
// @ts-expect-error TS7006
export const isInitialized = (state) => state.initialized;
// @ts-expect-error TS7006
export const configTenant = (state) => state.configTenant;
// @ts-expect-error TS7006
export const isEnableAutoPublication = (state) =>
    state.configTenant?.enableAutoPublication;
// @ts-expect-error TS7006
export const getError = (state) => state.error;

export const selectors = {
    isLoading,
    isInitialized,
    getError,
    configTenant,
    isEnableAutoPublication,
};
