import expect from 'expect';

import reducer, {
    defaultState,
    LOAD_RESOURCE,
    LOAD_RESOURCE_SUCCESS,
    LOAD_RESOURCE_ERROR,
} from './index';

describe('resourceReducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle LOAD_RESOURCE_SUCCESS', () => {
        const state = reducer({
            key: 'value',
        }, {
            type: LOAD_RESOURCE_SUCCESS,
            payload: 'resource',
        });
        expect(state).toEqual({
            key: 'value',
            resource: 'resource',
            error: null,
            loading: false,
        });
    });

    it('should handle LOAD_RESOURCE_ERROR', () => {
        const state = reducer({
            key: 'value',
        }, {
            type: LOAD_RESOURCE_ERROR,
            payload: { message: 'error' },
        });
        expect(state).toEqual({
            key: 'value',
            error: 'error',
            loading: false,
        });
    });

    it('should handle LOAD_RESOURCE', () => {
        const state = reducer({
            key: 'value',
        }, { type: LOAD_RESOURCE });
        expect(state).toEqual({
            key: 'value',
            error: null,
            loading: true,
        });
    });
});
