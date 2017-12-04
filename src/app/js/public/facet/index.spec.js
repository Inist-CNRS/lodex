import expect from 'expect';

import facetReducer, {
    OPEN_FACET,
    LOAD_FACET_VALUES_ERROR,
    LOAD_FACET_VALUES_SUCCESS,
    APPLY_FACET,
    REMOVE_FACET,
    CLEAR_FACET,
    FACET_VALUE_CHANGE,
    INVERT_FACET,
    FACET_VALUE_SORT,
} from './';

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
                        inverted: false,
                        sort: {
                            sortBy: 'count',
                            sortDir: 'DESC',
                        },
                    },
                },
            });
        });
    });

    describe('APPLY_FACET', () => {
        it('should add payload value to appliedFacets[name] array', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value'],
                },
            };

            const action = {
                type: APPLY_FACET,
                payload: { name: 'name', value: 'new value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value', 'new value'],
                },
            });
        });

        it('should do nothing if value is already in appliedFacets[name] array', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value', 'new value'],
                },
            };

            const action = {
                type: APPLY_FACET,
                payload: { name: 'name', value: 'new value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value', 'new value'],
                },
            });
        });

        it('should add payload value to appliedFacets[name] and create an array if none here', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                },
            };

            const action = {
                type: APPLY_FACET,
                payload: { name: 'fieldName', value: 'new value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    fieldName: ['new value'],
                },
            });
        });
    });

    describe('REMOVE_FACET', () => {
        it('should remove value from appliedFacets[name]', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value2', 'value3'],
                },
            };

            const action = {
                type: REMOVE_FACET,
                payload: { name: 'name', value: 'value2' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value3'],
                },
            });
        });

        it('should remove value from appliedFacets[name] and remove the array if no more values', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value'],
                },
            };

            const action = {
                type: REMOVE_FACET,
                payload: { name: 'name', value: 'value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                },
            });
        });

        it('should do nothing if value is absent from appliedFacets[name]', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value2', 'value3'],
                },
            };

            const action = {
                type: REMOVE_FACET,
                payload: { name: 'name', value: 'not found' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                    name: ['value1', 'value2', 'value3'],
                },
            });
        });

        it('should do nothing if appliedFacets[name] is not set', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
                },
            };

            const action = {
                type: REMOVE_FACET,
                payload: { name: 'name', value: 'value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    foo: 'bar',
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
        it('should set inverted to inverted', () => {
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
                type: INVERT_FACET,
                payload: {
                    name: 'name',
                    inverted: 'inverted',
                },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    name: {
                        foo: 'bar',
                        inverted: 'inverted',
                    },
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
