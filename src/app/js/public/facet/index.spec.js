import { createReducer } from './';

const { reducer: facetReducer, actionTypes } = createReducer('PREFIX');

const {
    OPEN_FACET,
    LOAD_FACET_VALUES_ERROR,
    LOAD_FACET_VALUES_SUCCESS,
    TOGGLE_FACET_VALUE,
    CLEAR_FACET,
    FACET_VALUE_CHANGE,
    INVERT_FACET,
    FACET_VALUE_SORT,
} = actionTypes;

describe('facet reducer', () => {
    describe('OPEN_FACET', () => {
        it('should set name to true in openedFacets', () => {
            const state = {
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                },
            };

            const action = {
                type: OPEN_FACET,
                payload: { name: 'target' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                    target: true,
                },
            });
        });
        it('should change field.name to false in openedFacets if its true', () => {
            const state = {
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                    target: true,
                },
            };

            const action = {
                type: OPEN_FACET,
                payload: { name: 'target' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                    target: false,
                },
            });
        });
        it('should change field.name to true in openedFacets if its false', () => {
            const state = {
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                    target: false,
                },
            };

            const action = {
                type: OPEN_FACET,
                payload: { name: 'target' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                openedFacets: {
                    fieldName: true,
                    otherField: false,
                    target: true,
                },
            });
        });
    });

    describe('LOAD_FACET_VALUES_ERROR', () => {
        it('should set error to message', () => {
            const state = {
                foo: 'bar',
            };

            const action = {
                type: LOAD_FACET_VALUES_ERROR,
                payload: { message: 'boom' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                error: 'boom',
            });
        });
    });

    describe('LOAD_FACET_VALUES_SUCCESS', () => {
        it('should set values to facetValues[field.name]', () => {
            const state = {
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                },
            };

            const action = {
                type: LOAD_FACET_VALUES_SUCCESS,
                payload: {
                    name: 'fieldName',
                    values: { data: 'values', total: 'total' },
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    fieldName: {
                        currentPage: 0,
                        perPage: 10,
                        filter: '',
                        values: 'values',
                        total: 'total',
                        sort: {
                            sortBy: 'count',
                            sortDir: 'DESC',
                        },
                    },
                },
            });
        });
    });

    describe('TOGGLE_FACET_VALUE', () => {
        it('should add payload value to appliedFacets[name] array', () => {
            const state = {
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [{ value: 'value1', count: 1, id: 'id1' }],
                },
            };

            const action = {
                type: TOGGLE_FACET_VALUE,
                payload: {
                    name: 'name',
                    facetValue: { value: 'value2', count: 4, id: 'id2' },
                },
            };

            expect(facetReducer(state, action)).toEqual({
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [
                        { value: 'value1', count: 1, id: 'id1' },
                        { value: 'value2', count: 4, id: 'id2' },
                    ],
                },
            });
        });

        it('should add payload value to appliedFacets[name] and create an array if none here', () => {
            const state = {
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                },
            };

            const action = {
                type: TOGGLE_FACET_VALUE,
                payload: {
                    name: 'name',
                    facetValue: { value: 'value', count: 4, id: 'id' },
                },
            };

            expect(facetReducer(state, action)).toEqual({
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [{ value: 'value', count: 4, id: 'id' }],
                },
            });
        });

        it('should remove value from appliedFacets[name]', () => {
            const state = {
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [
                        { value: 'value1', count: 1, id: 'id1' },
                        { value: 'value2', count: 4, id: 'id2' },
                        { value: 'value3', count: 3, id: 'id3' },
                    ],
                },
            };

            const action = {
                type: TOGGLE_FACET_VALUE,
                payload: {
                    name: 'name',
                    facetValue: { value: 'value2', count: 4, id: 'id2' },
                },
            };

            expect(facetReducer(state, action)).toEqual({
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [
                        { value: 'value1', count: 1, id: 'id1' },
                        { value: 'value3', count: 3, id: 'id3' },
                    ],
                },
            });
        });

        it('should remove value from appliedFacets[name] and remove the array if no more values', () => {
            const state = {
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                    name: [{ value: 'value', count: 1, id: 'id' }],
                },
            };

            const action = {
                type: TOGGLE_FACET_VALUE,
                payload: {
                    name: 'name',
                    facetValue: { value: 'value', count: 1, id: 'id' },
                },
            };

            expect(facetReducer(state, action)).toEqual({
                appliedFacets: {
                    foo: [{ value: 'bar' }],
                },
            });
        });
    });

    describe('CLEAR_FACET', () => {
        it('should clear appliedFacet[payload]', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value2'],
                },
                invertedFacets: {
                    bar: true,
                    name: true,
                },
            };

            const action = {
                type: CLEAR_FACET,
                payload: 'name',
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                },
                invertedFacets: {
                    bar: true,
                },
            });
        });

        it('should clear all appliedFacet and invertedFacets if payload is null', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value2'],
                },
                invertedFacets: {
                    foo: true,
                    name: true,
                },
            };

            const action = {
                type: CLEAR_FACET,
                payload: null,
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {},
                invertedFacets: {},
            });
        });
    });

    describe('FACET_VALUE_CHANGE', () => {
        it('should set filter, currentPage and perPage to facetsValues[name]', () => {
            const state = {
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                    },
                },
            };

            const action = {
                type: FACET_VALUE_CHANGE,
                payload: {
                    name: 'name',
                    filter: 'filter',
                    currentPage: 'currentPage',
                    perPage: 'perPage',
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        filter: 'filter',
                        currentPage: 'currentPage',
                        perPage: 'perPage',
                    },
                },
            });
        });
    });

    describe('INVERT_FACET', () => {
        it('should add name to invertedFacets if inverted is true', () => {
            const state = {
                foo: 'bar',
                invertedFacets: {
                    foo: 'bar',
                },
            };

            const action = {
                type: INVERT_FACET,
                payload: {
                    name: 'name',
                    inverted: true,
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                invertedFacets: {
                    foo: 'bar',
                    name: true,
                },
            });
        });

        it('should remove name from invertedFacets if inverted is false', () => {
            const state = {
                foo: 'bar',
                invertedFacets: {
                    foo: true,
                    name: true,
                },
            };

            const action = {
                type: INVERT_FACET,
                payload: {
                    name: 'name',
                    inverted: false,
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                invertedFacets: {
                    foo: true,
                },
            });
        });
    });

    describe('FACET_VALUE_SORT', () => {
        it('should replace sortDir ASC by DESC if sortBy equal sort.sortBy', () => {
            const state = {
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        sort: {
                            sortBy: 'sortBy',
                            sortDir: 'DESC',
                        },
                    },
                },
            };

            const action = {
                type: FACET_VALUE_SORT,
                payload: {
                    name: 'name',
                    nextSortBy: 'sortBy',
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        currentPage: 0,
                        sort: {
                            sortBy: 'sortBy',
                            sortDir: 'ASC',
                        },
                    },
                },
            });
        });

        it('should replace sortDir DESC by ASC if sortBy equal sort.sortBy', () => {
            const state = {
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        sort: {
                            sortBy: 'sortBy',
                            sortDir: 'ASC',
                        },
                    },
                },
            };

            const action = {
                type: FACET_VALUE_SORT,
                payload: {
                    name: 'name',
                    nextSortBy: 'sortBy',
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        currentPage: 0,
                        sort: {
                            sortBy: 'sortBy',
                            sortDir: 'DESC',
                        },
                    },
                },
            });
        });

        it('should set sort.sortBy to nextSortBy and sort.dir to DESC if sortDir different from sort.sortDir', () => {
            const state = {
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        sort: {
                            sortBy: 'other',
                            sortDir: 'ASC',
                        },
                    },
                },
            };

            const action = {
                type: FACET_VALUE_SORT,
                payload: {
                    name: 'name',
                    nextSortBy: 'sortBy',
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        currentPage: 0,
                        foo: 'bar',
                        sort: {
                            sortBy: 'sortBy',
                            sortDir: 'DESC',
                        },
                    },
                },
            });
        });
    });
});
