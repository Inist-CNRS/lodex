import expect from 'expect';

import reducer, {
    defaultState,
    getLoadDatasetPageRequest,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
} from './';

describe('dataset reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_DATASET_PAGE action', () => {
        const state = reducer(undefined, loadDatasetPage());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the LOAD_DATASET_PAGE_SUCCESS action', () => {
        const action = loadDatasetPageSuccess({ dataset: [{ foo: 'bar' }], page: 42, total: 1000 });
        const state = reducer({ loading: true, error: true }, action);
        expect(state).toEqual({
            error: null,
            loading: false,
            dataset: [{ foo: 'bar' }],
            currentPage: 42,
            total: 1000,
        });
    });

    it('should handle the LOAD_DATASET_PAGE_ERROR action', () => {
        const state = reducer({ loading: true }, loadDatasetPageError(new Error('foo')));
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });

    describe('getLoadDatasetPageRequest', () => {
        it('should return the correct request', () => {
            const request = getLoadDatasetPageRequest({ user: { token: 'test' } }, { page: 10, perPage: 50 });
            expect(request).toEqual({
                url: '/api/publishedDataset?page10&perPage=50',
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
