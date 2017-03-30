import expect from 'expect';

import TITLE_SCHEME from '../../../../common/titleScheme';

import reducer, {
    defaultState,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
    selectField,
    configureField,
    configureFieldSuccess,
    configureFieldError,
    configureFieldOpen,
    configureFieldCancel,
    openEditFieldValue,
    closeEditFieldValue,
    fromPublication,
    isACompositeFields,
} from './';

describe('publication reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_PUBLICATION action', () => {
        const state = reducer(undefined, loadPublication());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the LOAD_PUBLICATION_SUCCESS action', () => {
        const action = loadPublicationSuccess({
            characteristics: ['foo'],
            fields: [{ name: 'bar', value: 'data' }],
            published: true,
        });
        const state = reducer({ loading: true, error: true, published: false }, action);

        expect(state).toEqual({
            error: null,
            fields: ['bar'],
            byName: {
                bar: {
                    name: 'bar', value: 'data',
                },
            },
            loading: false,
            published: true,
            editedValueFieldName: null,
        });
    });

    it('should handle the LOAD_PUBLICATION_ERROR action', () => {
        const state = reducer({ loading: true }, loadPublicationError(new Error('foo')));
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });

    it('should handle the SELECT_FIELD action', () => {
        const state = reducer({ data: 'value' }, selectField('selectedFieldName'));
        expect(state).toEqual({
            data: 'value',
            selectedField: 'selectedFieldName',
        });
    });

    it('should handle the CONFIGURE_FIELD action', () => {
        const state = reducer({ data: 'value' }, configureField());
        expect(state).toEqual({
            data: 'value',
            error: null,
            isSaving: true,
        });
    });

    it('should handle the CONFIGURE_FIELD_SUCCESS action', () => {
        const state = reducer({ data: 'value', byName: {} }, configureFieldSuccess({ name: 'name', data: 'updated' }));
        expect(state).toEqual({
            data: 'value',
            byName: {
                name: { name: 'name', data: 'updated' },
            },
            isSaving: false,
            error: null,
            configuredFieldName: null,
        });
    });

    it('should handle the CONFIGURE_FIELD_ERROR action', () => {
        const state = reducer({ data: 'value' }, configureFieldError({ message: 'Boom' }));
        expect(state).toEqual({
            data: 'value',
            error: 'Boom',
            isSaving: false,
        });
    });

    it('should handle the CONFIGURE_FIELD_OPEN action', () => {
        const state = reducer({ data: 'value' }, configureFieldOpen('fieldName'));
        expect(state).toEqual({
            data: 'value',
            configuredFieldName: 'fieldName',
            error: null,
        });
    });

    it('should handle the CONFIGURE_FIELD_CANCEL action', () => {
        const state = reducer({ data: 'value' }, configureFieldCancel());
        expect(state).toEqual({
            data: 'value',
            configuredFieldName: null,
            error: null,
        });
    });

    it('should handle the OPEN_FIELD_VALUE action', () => {
        const state = reducer({ data: 'value' }, openEditFieldValue('fieldName'));
        expect(state).toEqual({
            data: 'value',
            editedValueFieldName: 'fieldName',
            error: null,
        });
    });


    it('should handle the CLOSE_EDIT_FIELD_VALUE action', () => {
        const state = reducer({ data: 'value' }, closeEditFieldValue('fieldName'));
        expect(state).toEqual({
            data: 'value',
            editedValueFieldName: null,
        });
    });

    describe('selectors', () => {
        describe('getCollectionFields', () => {
            it('should return the model', () => {
                expect(fromPublication.getCollectionFields({
                    fields: ['first', 'second'],
                    byName: {
                        first: { name: 'first', foo: 'bar', cover: 'collection' },
                        second: { name: 'second', foo: 'bar2', cover: 'dataset' },
                    },
                })).toEqual([{ name: 'first', foo: 'bar', cover: 'collection' }]);
            });
        });

        describe('getDatasetFields', () => {
            it('should return the model', () => {
                expect(fromPublication.getDatasetFields({
                    fields: ['first', 'second'],
                    byName: {
                        first: { name: 'first', foo: 'bar', cover: 'collection' },
                        second: { name: 'second', foo: 'bar2', cover: 'dataset' },
                    },
                })).toEqual([{ name: 'second', foo: 'bar2', cover: 'dataset' }]);
            });
        });

        describe('hasPublishedDataset', () => {
            it('should return true if published', () => {
                expect(fromPublication.hasPublishedDataset({ published: true })).toEqual(true);
            });
            it('should return false if published', () => {
                expect(fromPublication.hasPublishedDataset({ published: false })).toEqual(false);
            });
        });

        describe('getTitleFieldName', () => {
            it('should return field name of field with title scheme and cover collection', () => {
                const state = {
                    fields: ['dataset title', 'title', 'other'],
                    byName: {
                        'dataset title': { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                        title: { cover: 'collection', scheme: TITLE_SCHEME, name: 'title' },
                        other: { cover: 'collection', scheme: 'other scheme', name: 'other' },
                    },
                };
                expect(fromPublication.getTitleFieldName(state)).toBe('title');
            });

            it('should return field name of field with a label matching title', () => {
                const state = {
                    fields: ['dataset title', 'title', 'other'],
                    byName: {
                        'dataset title': {
                            cover: 'dataset',
                            scheme: TITLE_SCHEME,
                            name: 'dataset title',
                            label: 'foo_dataset',
                        },
                        title: {
                            cover: 'collection',
                            scheme: 'other scheme',
                            name: 'title',
                            label: 'title',
                        },
                        other: {
                            cover: 'collection',
                            scheme: 'other scheme',
                            name: 'other',
                            label: 'foo2',
                        },
                    },
                };
                expect(fromPublication.getTitleFieldName(state)).toBe('title');
            });

            it('should return null if no field found', () => {
                const state = {
                    fields: ['dataset title', 'title', 'other'],
                    byName: {
                        'dataset title': {
                            cover: 'dataset',
                            scheme: TITLE_SCHEME,
                            name: 'dataset title',
                            label: 'foo_dataset',
                        },
                        title: {
                            cover: 'collection',
                            scheme: 'other scheme',
                            name: 'title',
                            label: 'foo',
                        },
                        other: {
                            cover: 'collection',
                            scheme: 'other scheme',
                            name: 'other',
                            label: 'foo2',
                        },
                    },
                };
                expect(fromPublication.getTitleFieldName(state)).toBe(null);
            });
        });

        describe('getContributionFields', () => {
            it('should return fields with contribution true', () => {
                const state = {
                    fields: ['field1', 'field2', 'field3', 'field4'],
                    byName: {
                        field1: { name: 'field1' },
                        field2: { name: 'field2', contribution: true },
                        field3: { name: 'field3' },
                        field4: { name: 'field4', contribution: true },
                    },
                };

                expect(fromPublication.getContributionFields(state)).toEqual([
                { name: 'field2', contribution: true },
                { name: 'field4', contribution: true },
                ]);
            });
        });

        describe('isAcompositeFields', () => {
            it('should return true if field name is part of composedOf of one of the composedOf Field', () => {
                expect(isACompositeFields('composite', [
                    {
                        composedOf: {
                            fields: ['field1', 'field1'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field3', 'composite'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field4', 'field5'],
                        },
                    },
                ])).toBe(true);
            });

            it('should return true if field name is part of composedOf of one of the composedOf Field', () => {
                expect(isACompositeFields('composite', [
                    {
                        composedOf: {
                            fields: ['field1', 'field1'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field3', 'field6'],
                        },
                    },
                    {
                        composedOf: {
                            fields: ['field4', 'field5'],
                        },
                    },
                ])).toBe(false);
            });

            it('should return false if no composedOf Field', () => {
                expect(isACompositeFields('composite', [])).toBe(false);
            });
        });

        describe('isFieldEdited', () => {
            it('should return true if given fieldname is equal to editedValueFieldName', () => {
                expect(fromPublication.isFieldEdited({ editedValueFieldName: 'name' }, 'name'))
                    .toBe(true);
            });

            it('should return false if given fieldname is different from editedValueFieldName', () => {
                expect(fromPublication.isFieldEdited({ editedValueFieldName: 'name' }, 'no name'))
                    .toBe(false);
            });
        });

        describe('isFieldConfigured', () => {
            it('should return true if given fieldname is equal to configuredFieldName', () => {
                expect(fromPublication.isFieldConfigured({ configuredFieldName: 'name' }, 'name'))
                    .toBe(true);
            });

            it('should return false if given fieldname is different from configuredFieldName', () => {
                expect(fromPublication.isFieldConfigured({ configuredFieldName: 'name' }, 'no name'))
                    .toBe(false);
            });
        });
    });

    describe('getFieldToAdd', () => {
        it('should return byName[selectedField]', () => {
            const state = {
                byName: {
                    name: {
                        field: 'data',
                    },
                },
                selectedField: 'name',
            };

            expect(fromPublication.getFieldToAdd(state)).toEqual({ field: 'data' });
        });

        it('should omit contributors and _id from byName[selectedField]', () => {
            const state = {
                byName: {
                    name: {
                        field: 'data',
                        cover: 'collection',
                        _id: 'who cares',
                        contributors: 'some random guy',
                    },
                },
                selectedField: 'name',
            };

            expect(fromPublication.getFieldToAdd(state)).toEqual({
                field: 'data',
                cover: 'collection',
            });
        });

        it('should return { cover: document } if selectedField is new', () => {
            const state = {
                byName: {
                    name: {
                        field: 'data',
                    },
                    new: 'ignore me',
                },
                selectedField: 'new',
            };

            expect(fromPublication.getFieldToAdd(state)).toEqual({ cover: 'document' });
        });


        it('should return null if selectedField is not in byName', () => {
            const state = {
                byName: {
                    name: {
                        field: 'data',
                    },
                },
                selectedField: '404',
            };

            expect(fromPublication.getFieldToAdd(state)).toBe(null);
        });
    });
});
