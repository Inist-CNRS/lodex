import expect from 'expect';

import reducer, {
    defaultState,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
    applyFilter,
} from './';

describe('dataset reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_DATASET_PAGE action', () => {
        const state = reducer(undefined, loadDatasetPage({ perPage: 'perPage' }));
        expect(state).toEqual({
            ...state,
            loading: true,
            perPage: 'perPage',
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

    it('should handle APPLY_FILTER action', () => {
        const state = reducer({}, applyFilter('foo'));
        expect(state).toEqual({
            currentPage: 0,
            match: 'foo',
        });
    });
});
