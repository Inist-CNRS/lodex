import expect from 'expect';

import reducer, {
    defaultState,
    loadFieldSuccess,
    loadFieldError,
    getLoadFieldRequest,
} from './';

describe('fields', () => {
    describe('reducer', () => {
        it('should initialize with correct state', () => {
            const state = reducer(undefined, { type: '@@INIT' });
            expect(state).toEqual(defaultState);
        });

        it('should handle the LOAD_FIELD_SUCCESS', () => {
            const state = reducer([], loadFieldSuccess(['fields']));
            expect(state).toEqual(['fields']);
        });

        it('should handle the LOAD_FIELD_ERROR', () => {
            const state = reducer(['fields'], loadFieldError());
            expect(state).toEqual([]);
        });
    });

    describe('getLoadFieldRequest', () => {
        it('should return the correct request', () => {
            const request = getLoadFieldRequest({ user: { token: 'test' } });
            expect(request).toEqual({
                url: '/api/field',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer test',
                    'Content-Type': 'application/json',
                },
            });
        });
    });
});
