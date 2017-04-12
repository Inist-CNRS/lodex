import expect from 'expect';

import reducer, {
    defaultState,
    LOAD_RESOURCE,
    LOAD_RESOURCE_SUCCESS,
    LOAD_RESOURCE_ERROR,
    SAVE_RESOURCE,
    saveResourceSuccess,
    SAVE_RESOURCE_ERROR,
    HIDE_RESOURCE,
    HIDE_RESOURCE_SUCCESS,
    HIDE_RESOURCE_ERROR,
    ADD_FIELD_TO_RESOURCE,
    ADD_FIELD_TO_RESOURCE_SUCCESS,
    ADD_FIELD_TO_RESOURCE_ERROR,
    changeFieldStatus,
    changeFieldStatusSuccess,
    changeFieldStatusError,
    selectVersion,
    addFieldToResourceOpen,
    addFieldToResourceCancel,
    hideResourceOpen,
    hideResourceCancel,
    fromResource,
} from './index';
import { PROPOSED, VALIDATED, REJECTED } from '../../../../common/propositionStatus';

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

    it('should handle SAVE_RESOURCE_SUCCESS', () => {
        const state = { data: 'value', resource: 'resource' };
        expect(reducer(state, saveResourceSuccess('new resource')))
        .toEqual({
            data: 'value',
            resource: 'new resource',
            error: null,
            saving: false,
        });
    });

    it('should handle SAVE_RESOURCE_SUCCESS with no resource change', () => {
        const state = { data: 'value', resource: 'resource' };
        expect(reducer(state, saveResourceSuccess()))
        .toEqual({
            data: 'value',
            resource: 'resource',
            error: null,
            saving: false,
        });
    });

    it('should handle HIDE_RESOURCE_SUCCESS, ADD_FIELD_TO_RESOURCE_SUCCESS', () => {
        [
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
                addingField: null,
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

    it('should handle CHANGE_FIELD_STATUS', () => {
        const state = {
            resource: {
                data: 'value',
                contributions: [
                    { fieldName: 'field', status: 'status', other: 'data' },
                    { fieldName: 'target', status: 'status', other: 'data' },
                    { fieldName: 'miss', status: 'status', other: 'data' },
                ],
            },
        };

        expect(reducer(state, changeFieldStatus({ field: 'target', status: 'new status' })))
            .toEqual({
                moderating: true,
                resource: {
                    data: 'value',
                    contributions: [
                        { fieldName: 'field', status: 'status', other: 'data' },
                        { fieldName: 'target', status: 'new status', other: 'data' },
                        { fieldName: 'miss', status: 'status', other: 'data' },
                    ],
                },
            });
    });

    it('should handle CHANGE_FIELD_STATUS_SUCCESS', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, changeFieldStatusSuccess()))
            .toEqual({
                data: 'value',
                error: null,
                moderating: false,
            });
    });

    it('should handle CHANGE_FIELD_STATUS_ERROR', () => {
        const state = {
            data: 'value',
            resource: {
                contributions: [
                    { fieldName: 'field', status: 'status', other: 'data' },
                    { fieldName: 'target', status: 'updated status', other: 'data' },
                    { fieldName: 'miss', status: 'status', other: 'data' },
                ],
            },
        };

        const action = changeFieldStatusError({
            error: 'boom',
            field: 'target',
            prevStatus: 'previous status',
        });

        expect(reducer(state, action))
            .toEqual({
                data: 'value',
                error: 'boom',
                moderating: false,
                resource: {
                    contributions: [
                        { fieldName: 'field', status: 'status', other: 'data' },
                        { fieldName: 'target', status: 'previous status', other: 'data' },
                        { fieldName: 'miss', status: 'status', other: 'data' },
                    ],
                },
            });
    });

    it('should handle SELECT_VERSION action', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, selectVersion('version')))
            .toEqual({
                data: 'value',
                selectedVersion: 'version',
            });
    });

    it('should handle ADD_FIELD_TO_RESOURCE_OPEN action', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, addFieldToResourceOpen()))
            .toEqual({
                data: 'value',
                error: null,
                addingField: true,
            });
    });

    it('should handle ADD_FIELD_TO_RESOURCE_CANCEL action', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, addFieldToResourceCancel()))
            .toEqual({
                data: 'value',
                error: null,
                addingField: false,
            });
    });

    it('should handle HIDE_RESOURCE_OPEN action', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, hideResourceOpen()))
            .toEqual({
                data: 'value',
                error: null,
                hiding: true,
            });
    });

    it('should handle HIDE_RESOURCE_CANCEL action', () => {
        const state = {
            data: 'value',
        };

        expect(reducer(state, hideResourceCancel()))
            .toEqual({
                data: 'value',
                error: null,
                hiding: false,
            });
    });

    describe('selector', () => {
        describe('getResourceProposedFields', () => {
            it('should return list of fields with status proposed', () => {
                const state = {
                    resource: {
                        contributions: [
                            { fieldName: 'validatedField', status: VALIDATED },
                            { fieldName: 'proposedField', status: PROPOSED },
                            { fieldName: 'othervalidatedField', status: VALIDATED },
                            { fieldName: 'otherProposedField', status: PROPOSED },
                            { fieldName: 'rejectedField', status: REJECTED },
                        ],
                    },
                };
                expect(fromResource.getResourceProposedFields(state))
                    .toEqual(['proposedField', 'otherProposedField']);
            });
        });

        describe('getResourceContributorsCatalog', () => {
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

                expect(fromResource.getResourceContributorsCatalog(state)).toEqual({
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
