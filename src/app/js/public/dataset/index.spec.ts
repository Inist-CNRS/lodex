import reducer, {
    defaultState,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
    sortDataset,
    applyFilter,
    facetActionTypes,
} from './';

describe('dataset reducer', () => {
    it('should initialize with correct state', () => {
        // @ts-expect-error TS2345
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_DATASET_PAGE action', () => {
        const state = reducer(
            undefined,
            loadDatasetPage({ perPage: 'perPage' }),
        );
        expect(state).toEqual({
            ...state,
            loading: true,
            perPage: 'perPage',
        });
    });

    it('should handle the LOAD_DATASET_PAGE_SUCCESS action', () => {
        const action = loadDatasetPageSuccess({
            dataset: [{ foo: 'bar' }],
            page: 42,
            total: 100,
            fullTotal: 4200,
        });
        // @ts-expect-error TS2345
        const state = reducer({ loading: true, error: true }, action);
        expect(state).toEqual({
            error: null,
            loading: false,
            dataset: [{ foo: 'bar' }],
            currentPage: 42,
            total: 100,
            fullTotal: 4200,
        });
    });

    it('should handle the LOAD_DATASET_PAGE_ERROR action', () => {
        const state = reducer(
            // @ts-expect-error TS2345
            { loading: true },
            loadDatasetPageError(new Error('foo')),
        );
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });

    it('should handle APPLY_FILTER action', () => {
        // @ts-expect-error TS2345
        const state = reducer({ perPage: 20 }, applyFilter('foo'));
        expect(state).toEqual({
            currentPage: 0,
            error: null,
            loading: true,
            formatLoading: true,
            match: 'foo',
            perPage: 20,
            sort: {},
        });
    });

    it('should handle TOGGLE_FACET_VALUE action', () => {
        const state = reducer(
            // @ts-expect-error TS2345
            { perPage: 20 },
            { type: facetActionTypes.TOGGLE_FACET_VALUE, payload: {} },
        );
        // @ts-expect-error TS2339
        delete state.facet;
        expect(state).toEqual({
            currentPage: 0,
            error: null,
            loading: true,
            formatLoading: true,
            perPage: 20,
        });
    });

    it('should handle SORT_DATASET action', () => {
        // @ts-expect-error TS2345
        const state = reducer({ sort: {} }, sortDataset('field'));
        expect(state).toEqual({
            currentPage: 0,
            sort: {
                sortBy: 'field',
                sortDir: 'ASC',
            },
        });
    });

    it('should handle SORT_DATASET action and invert sortDir when sortBy do not change', () => {
        const state = reducer(
            // @ts-expect-error TS2345
            { sort: { sortBy: 'field', sortDir: 'ASC' } },
            sortDataset('field'),
        );
        expect(state).toEqual({
            currentPage: 0,
            sort: {
                sortBy: 'field',
                sortDir: 'DESC',
            },
        });
    });

    it('should handle SORT_DATASET action and invert sortDir when sortBy do not change 2', () => {
        const state = reducer(
            // @ts-expect-error TS2345
            { sort: { sortBy: 'field', sortDir: 'DESC' } },
            sortDataset('field'),
        );
        expect(state).toEqual({
            currentPage: 0,
            sort: {
                sortBy: 'field',
                sortDir: 'ASC',
            },
        });
    });
});
