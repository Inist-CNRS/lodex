import expect from 'expect';

import facetReducer, {
    OPEN_FACET,
    LOAD_FACET_VALUES_ERROR,
    LOAD_FACET_VALUES_SUCCESS,
    APPLY_FACET,
    REMOVE_FACET,
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
                payload: { name: 'fieldName', values: 'values' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                facetsValues: {
                    foo: 'bar',
                    fieldName: 'values',
                },
            });
        });
    });

    describe('APPLY_FACET', () => {
        it('should add payload to appliedFacets', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    name1: 'value1',
                    name2: 'value2',
                    name3: 'value3',
                },
            };

            const action = {
                type: APPLY_FACET,
                payload: { name: 'fieldName', value: 'new value' },
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    name1: 'value1',
                    name2: 'value2',
                    name3: 'value3',
                    fieldName: 'new value',
                },
            });
        });
    });

    describe('REMOVE_FACET', () => {
        it('should remove appliedFacets with field.name equal to payload.name', () => {
            const state = {
                foo: 'bar',
                appliedFacets: {
                    name1: 'value1',
                    name2: 'value2',
                    name3: 'value3',
                },
            };

            const action = {
                type: REMOVE_FACET,
                payload: 'name2',
            };

            expect(facetReducer(state, action)).toEqual({
                foo: 'bar',
                appliedFacets: {
                    name1: 'value1',
                    name2: undefined,
                    name3: 'value3',
                },
            });
        });
    });
});
