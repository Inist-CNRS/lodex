import expect from 'expect';

import reducer, {
    defaultState,
    getLoadRemovedResourcePageRequest,
    loadRemovedResourcePage,
    loadRemovedResourcePageSuccess,
    loadRemovedResourcePageError,
} from './';

describe('removed resource reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_REMOVED_RESOURCE_PAGE action', () => {
        const state = reducer(undefined, loadRemovedResourcePage());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the LOAD_REMOVED_RESOURCE_PAGE_SUCCESS action', () => {
        const action = loadRemovedResourcePageSuccess({ resources: [{ foo: 'bar' }], page: 42, total: 1000 });
        const state = reducer({ loading: true, error: true }, action);
        expect(state).toEqual({
            error: false,
            loading: false,
            items: [{ foo: 'bar' }],
            currentPage: 42,
            total: 1000,
        });
    });

    it('should handle the LOAD_REMOVED_RESOURCE_PAGE_ERROR action', () => {
        const state = reducer({ loading: true }, loadRemovedResourcePageError(new Error('foo')));
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });

    describe('getLoadRemovedResourcePageRequest', () => {
        it('should return the correct request', () => {
            const request = getLoadRemovedResourcePageRequest({ user: { token: 'test' } }, { page: 10, perPage: 50 });
            expect(request).toEqual({
                url: '/api/publishedDataset/removed?page=10&perPage=50',
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
