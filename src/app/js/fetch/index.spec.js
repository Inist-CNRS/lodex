import expect from 'expect';

import reducer, { defaultState, fetch, fetchSuccess, fetchError } from './';

describe('fetch', () => {
    describe('reducer', () => {
        it('should initialize with correct state', () => {
            const state = reducer(undefined, { type: '@@INIT' });
            expect(state).toEqual(defaultState);
        });

        it('should handle the FETCH action', () => {
            const state = reducer(
                {},
                fetch({ config: { url: 'url' }, name: 'foo' }),
            );
            expect(state).toEqual({
                foo: {
                    url: 'url',
                    error: null,
                    loading: true,
                    response: null,
                },
            });
        });

        it('should handle the FETCH_SUCCESS action', () => {
            const state = reducer(
                {
                    foo: {
                        url: 'url',
                        error: null,
                        loading: true,
                        response: null,
                    },
                },
                fetchSuccess({ response: [], name: 'foo' }),
            );
            expect(state).toEqual({
                foo: {
                    url: 'url',
                    error: null,
                    loading: false,
                    response: [],
                },
            });
        });

        it('should handle the FETCH_ERROR action', () => {
            const state = reducer(
                {
                    foo: {
                        url: 'url',
                        error: null,
                        loading: true,
                        response: null,
                    },
                },
                fetchError({ error: 'error', name: 'foo' }),
            );
            expect(state).toEqual({
                foo: {
                    url: 'url',
                    error: 'error',
                    loading: false,
                    response: null,
                },
            });
        });
    });
});
