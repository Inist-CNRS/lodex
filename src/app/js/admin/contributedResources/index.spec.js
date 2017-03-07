import expect from 'expect';

import reducer, {
    defaultState,
    loadContributedResourcePage,
    loadContributedResourcePageSuccess,
    loadContributedResourcePageError,
} from './';

describe('contributed resource reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_CONTRIBUTED_RESOURCE_PAGE action', () => {
        const state = reducer(undefined, loadContributedResourcePage());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the LOAD_CONTRIBUTED_RESOURCE_PAGE_SUCCESS action', () => {
        const action = loadContributedResourcePageSuccess({
            resources: [
                {
                    foo: 'bar',
                },
            ],
            page: 42,
            total: 1000,
        });
        const state = reducer({
            loading: true,
            error: true,
        }, action);
        expect(state).toEqual({
            error: false,
            loading: false,
            items: [
                {
                    foo: 'bar',
                },
            ],
            currentPage: 42,
            total: 1000,
        });
    });

    it('should handle the LOAD_CONTRIBUTED_RESOURCE_PAGE_ERROR action', () => {
        const state = reducer({
            loading: true,
        }, loadContributedResourcePageError(new Error('foo')));
        expect(state).toEqual({ loading: false, error: 'foo' });
    });
});
