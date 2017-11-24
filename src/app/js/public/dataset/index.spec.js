import expect from 'expect';

import reducer, {
    defaultState,
    loadDatasetPage,
    loadDatasetPageSuccess,
    loadDatasetPageError,
    sortDataset,
    applyFilter,
} from './';
import { APPLY_FACET } from '../facet';

describe('dataset reducer', () => {
    it('should initialize with correct state', () => {
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
            total: 1000,
        });
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
        const state = reducer(
            { loading: true },
            loadDatasetPageError(new Error('foo')),
        );
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });

    it('should handle APPLY_FILTER action', () => {
        const state = reducer({ perPage: 20 }, applyFilter('foo'));
        expect(state).toEqual({
            currentPage: 0,
            error: null,
            loading: true,
            match: 'foo',
            perPage: 20,
        });
    });

    it('should handle APPLY_FACET action', () => {
        const state = reducer({ perPage: 20 }, { type: APPLY_FACET });
        expect(state).toEqual({
            currentPage: 0,
            error: null,
            loading: true,
            perPage: 20,
        });
    });

    it('should handle SORT_DATASET action', () => {
        const state = reducer({ sort: {} }, sortDataset('field'));
        expect(state).toEqual({
            sort: {
                sortBy: 'field',
                sortDir: 'ASC',
            },
        });
    });

    it('should handle SORT_DATASET action and invert sortDir when sortBy do not change', () => {
        const state = reducer(
            { sort: { sortBy: 'field', sortDir: 'ASC' } },
            sortDataset('field'),
        );
        expect(state).toEqual({
            sort: {
                sortBy: 'field',
                sortDir: 'DESC',
            },
        });
    });

    it('should handle SORT_DATASET action and invert sortDir when sortBy do not change', () => {
        const state = reducer(
            { sort: { sortBy: 'field', sortDir: 'DESC' } },
            sortDataset('field'),
        );
        expect(state).toEqual({
            sort: {
                sortBy: 'field',
                sortDir: 'ASC',
            },
        });
    });
});
