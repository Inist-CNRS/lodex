import expect from 'expect';

import reducer, {
    defaultState,
    LOAD_RESOURCE,
    LOAD_RESOURCE_SUCCESS,
    LOAD_RESOURCE_ERROR,
    SAVE_RESOURCE,
    SAVE_RESOURCE_SUCCESS,
    SAVE_RESOURCE_ERROR,
    HIDE_RESOURCE,
    HIDE_RESOURCE_SUCCESS,
    HIDE_RESOURCE_ERROR,
    ADD_FIELD_TO_RESOURCE,
    ADD_FIELD_TO_RESOURCE_SUCCESS,
    ADD_FIELD_TO_RESOURCE_ERROR,
    fromResource,
} from './index';

describe('resourceReducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle LOAD_RESOURCE_SUCCESS', () => {
        const state = reducer({
            key: 'value',
        }, {
            type: LOAD_RESOURCE_SUCCESS,
            payload: 'resource',
        });
        expect(state).toEqual({
            key: 'value',
            resource: 'resource',
            error: null,
            loading: false,
            saving: false,
        });
    });

    it('should handle LOAD_RESOURCE_ERROR', () => {
        const state = reducer({
            key: 'value',
        }, {
            type: LOAD_RESOURCE_ERROR,
            payload: { message: 'error' },
        });
        expect(state).toEqual({
            key: 'value',
            error: 'error',
            loading: false,
            saving: false,
        });
    });

    it('should handle LOAD_RESOURCE', () => {
        const state = reducer({
            key: 'value',
        }, { type: LOAD_RESOURCE });
        expect(state).toEqual({
            key: 'value',
            error: null,
            loading: true,
            saving: false,
        });
    });

    it('should handle SAVE_RESOURCE, HIDE_RESOURCE and ADD_FIELD_TO_RESOURCE', () => {
        [
            SAVE_RESOURCE,
            HIDE_RESOURCE,
            ADD_FIELD_TO_RESOURCE,
        ].forEach((type) => {
            const state = reducer({
                key: 'value',
            }, { type });
            expect(state).toEqual({
                key: 'value',
                error: null,
                saving: true,
            });
        });
    });

    it('should handle SAVE_RESOURCE_SUCCESS, HIDE_RESOURCE_SUCCESS, ADD_FIELD_TO_RESOURCE_SUCCESS', () => {
        [
            SAVE_RESOURCE_SUCCESS,
            HIDE_RESOURCE_SUCCESS,
            ADD_FIELD_TO_RESOURCE_SUCCESS,
        ].forEach((type) => {
            const state = reducer({
                key: 'value',
            }, { type });
            expect(state).toEqual({
                key: 'value',
                error: null,
                saving: false,
            });
        });
    });

    it('should handle SAVE_RESOURCE_ERROR, HIDE_RESOURCE_ERROR, ADD_FIELD_TO_RESOURCE_ERROR', () => {
        [
            SAVE_RESOURCE_ERROR,
            HIDE_RESOURCE_ERROR,
            ADD_FIELD_TO_RESOURCE_ERROR,
        ].forEach((type) => {
            const state = reducer({
                key: 'value',
            }, { type, payload: { message: 'boom' } });
            expect(state).toEqual({
                key: 'value',
                error: 'boom',
                saving: false,
            });
        });
    });

    describe('selector', () => {
        describe('getResourceUnvalidatedFields', () => {
            it('should return list of fields with accepted false', () => {
                const state = {
                    resource: {
                        contributions: [
                            { fieldName: 'acceptedField', accepted: true },
                            { fieldName: 'unvalidatedField', accepted: false },
                            { fieldName: 'otherAcceptedField', accepted: true },
                            { fieldName: 'otherUnvalidatedField', accepted: false },
                        ],
                    },
                };
                expect(fromResource.getResourceUnvalidatedFields(state))
                    .toEqual(['unvalidatedField', 'otherUnvalidatedField']);
            });
        });

        describe('getResourceContributorsByField', () => {
            it('should return contributor name keyed with their field', () => {
                const state = {
                    resource: {
                        contributions: [
                            { fieldName: 'field1', contributor: { name: 'contributor1' } },
                            { fieldName: 'field2', contributor: { name: 'contributor2' } },
                            { fieldName: 'field3', contributor: { name: 'contributor3' } },
                            { fieldName: 'field4', contributor: { name: 'contributor4' } },
                        ],
                    },
                };

                expect(fromResource.getResourceContributorsByField(state)).toEqual({
                    field1: 'contributor1',
                    field2: 'contributor2',
                    field3: 'contributor3',
                    field4: 'contributor4',
                });
            });
        });

        describe('getResourceLastVersion', () => {
            it('should return lasst items in versions for resource + uri', () => {
                const state = {
                    resource: {
                        uri: 'uri',
                        versions: [
                            { data: 'version1' },
                            { data: 'version2' },
                            { data: 'version3' },
                        ],
                    },
                };

                expect(fromResource.getResourceLastVersion(state)).toEqual({
                    uri: 'uri',
                    data: 'version3',
                });
            });
        });
    });
});
