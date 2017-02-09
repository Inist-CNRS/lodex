import expect from 'expect';

import reducer, {
    defaultState,
    LOAD_RESOURCE,
    LOAD_RESOURCE_SUCCESS,
    LOAD_RESOURCE_ERROR,
    SAVE_RESOURCE,
    SAVE_RESOURCE_SUCCESS,
    SAVE_RESOURCE_ERROR,
    HIDE_RESOURCE,
    HIDE_RESOURCE_SUCCESS,
    HIDE_RESOURCE_ERROR,
} from './index';

describe.only('resourceReducer', () => {
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
            saving: false,
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
            saving: false,
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
            saving: false,
        });
    });

    it('should handle SAVE_RESOURCE', () => {
        const state = reducer({
            key: 'value',
        }, { type: SAVE_RESOURCE });
        expect(state).toEqual({
            key: 'value',
            error: null,
            saving: true,
        });
    });

    it('should handle SAVE_RESOURCE_SUCCESS', () => {
        const state = reducer({
            key: 'value',
        }, { type: SAVE_RESOURCE_SUCCESS });
        expect(state).toEqual({
            key: 'value',
            error: null,
            saving: false,
        });
    });

    it('should handle SAVE_RESOURCE_ERROR', () => {
        const state = reducer({
            key: 'value',
        }, { type: SAVE_RESOURCE_ERROR, payload: { message: 'boom' } });
        expect(state).toEqual({
            key: 'value',
            error: 'boom',
            saving: false,
        });
    });

    it('should handle HIDE_RESOURCE', () => {
        const state = reducer({
            key: 'value',
        }, { type: HIDE_RESOURCE });
        expect(state).toEqual({
            key: 'value',
            error: null,
            saving: true,
        });
    });

    it('should handle HIDE_RESOURCE_SUCCESS', () => {
        const state = reducer({
            key: 'value',
        }, { type: HIDE_RESOURCE_SUCCESS });
        expect(state).toEqual({
            key: 'value',
            error: null,
            saving: false,
        });
    });

    it('should handle HIDE_RESOURCE_ERROR', () => {
        const state = reducer({
            key: 'value',
        }, { type: HIDE_RESOURCE_ERROR, payload: { message: 'boom' } });
        expect(state).toEqual({
            key: 'value',
            error: 'boom',
            saving: false,
        });
    });
});
