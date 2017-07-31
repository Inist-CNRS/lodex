import expect from 'expect';

import TITLE_SCHEME from '../../../common/titleScheme';
import reducer, {
    defaultState,
    selectors,
    addField,
    editField,
    loadFieldError,
    loadFieldSuccess,
    removeFieldSuccess,
    getLineColGetterFromAllFields,
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
    isACompositeFields,
} from './';

describe('field reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    describe('addField', () => {
        it('should handle the ADD_FIELD action with no name', () => {
            const state = reducer({
                byName: {
                    name1: { name: 'name1', label: 'foo' },
                    name2: { name: 'name2', label: 'bar' },
                },
                list: ['name1', 'name2'],
            }, addField());

            expect(state).toEqual({
                ...state,
                editedFieldName: 'new',
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { name: 'name2', label: 'bar' },
                    name1: { name: 'name1', label: 'foo' },
                    new: {
                        label: 'newField 3',
                        cover: 'collection',
                        name: 'new',
                        display_in_list: true,
                        display_in_resource: true,
                        searchable: true,
                        transformers: [],
                        position: 2,
                        overview: 0,
                        classes: [],
                    },
                },
            });
        });
        it('should handle the ADD_FIELD action with name', () => {
            const state = reducer({
                byName: {
                    name1: { name: 'name1', label: 'foo' },
                    name2: { name: 'name2', label: 'bar' },
                },
                list: ['name1', 'name2'],
            }, addField('target_col'));

            expect(state).toEqual({
                ...state,
                editedFieldName: 'new',
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { name: 'name2', label: 'bar' },
                    name1: { name: 'name1', label: 'foo' },
                    new: {
                        label: 'target_col',
                        cover: 'collection',
                        name: 'new',
                        display_in_list: true,
                        display_in_resource: true,
                        searchable: true,
                        transformers: [{
                            operation: 'COLUMN',
                            args: [{
                                name: 'column',
                                type: 'column',
                                value: 'target_col',
                            }],
                        }],
                        position: 2,
                        overview: 0,
                        class: [],
                    },
                },
            });
        }); it('should handle the LOAD_PUBLICATION action', () => {
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
                list: ['bar'],
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
    });

    describe('loadFile', () => {
        it('should handle the LOAD_FIELD_ERROR action', () => {
            const state = reducer({ ...defaultState }, loadFieldError('foo'));
            expect(state).toEqual(defaultState);
        });

        it('should handle the LOAD_FIELD_SUCCESS action', () => {
            const state = reducer({ ...defaultState, list: ['foo'] }, loadFieldSuccess([
                { name: 'bar_name', foo: 'bar' },
                { name: 'foo_name', foo: 'foo' },
            ]));
            expect(state).toEqual({
                ...defaultState,
                list: ['bar_name', 'foo_name'],
                byName: {
                    bar_name: { name: 'bar_name', foo: 'bar' },
                    foo_name: { name: 'foo_name', foo: 'foo' },
                },
            });
        });
    });

    describe('editField', () => {
        it('should handle the EDIT_FIELD action', () => {
            const state = reducer({
                list: ['name1', 'name2', 'name3'],
            }, editField(1));
            expect(state).toEqual({
                list: ['name1', 'name2', 'name3'],
                editedFieldName: 'name2',
            });
        });
    });

    describe('removeFieldSuccess', () => {
        it('should handle the REMOVE_FIELD_SUCCESS action', () => {
            const state = reducer({
                list: ['bar', 'foo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                },
            }, removeFieldSuccess({ name: 'foo' }));
            expect(state).toEqual({
                list: ['bar'],
                byName: {
                    bar: { name: 'bar' },
                },
            });
        });
    });

    describe('selectors', () => {
        describe('getFields', () => {
            it('should return array of all fields', () => {
                const state = {
                    list: ['name1', 'name2', 'name3'],
                    byName: {
                        name1: 'field1',
                        name2: 'field2',
                        name3: 'field3',
                        name4: 'field4',
                    },
                };
                expect(selectors.getFields(state))
                    .toEqual(['field1', 'field2', 'field3']);
            });
        });

        describe('getNbFields', () => {
            it('should return list length', () => {
                expect(selectors.getNbFields({ list: [1, 2, 3] }))
                .toBe(3);
            });
        });

        describe('getEditedField', () => {
            it('should return editedField', () => {
                expect(selectors.getEditedField({
                    editedFieldName: 'name2',
                    byName: {
                        name1: 'field1',
                        name2: 'field2',
                        name3: 'field3',
                    },
                })).toBe('field2');
            });
        });

        describe('getLineColGetterFromAllFields', () => {
            it('should return a function returning line value for given field', () => {
                const field = {
                    name: 'field',
                };
                const getLineCol = getLineColGetterFromAllFields({ field }, field);
                expect(getLineCol({ field: 'value', other: 'data' }))
                    .toEqual('value');
            });
            it('should stringify result if it is an array', () => {
                const field = {
                    name: 'field',
                };
                const getLineCol = getLineColGetterFromAllFields({ field }, field);
                expect(getLineCol({ field: ['value1', 'value2'], other: 'data' }))
                    .toEqual('["value1","value2"]');
            });
        });

        describe('getFieldsForPreview', () => {
            it('should return all fields if no formData', () => {
                const state = {
                    list: ['field1', 'field2', 'field3'],
                    editedFieldName: 'field2',
                    byName: {
                        field1: 'value1',
                        field2: 'value2',
                        field3: 'value3',
                    },
                };

                expect(selectors.getFieldsForPreview(state)).toEqual(['value1', 'value2', 'value3']);
            });

            it('should return all fields if no editedFieldName', () => {
                const state = {
                    list: ['field1', 'field2', 'field3'],
                    byName: {
                        field1: 'value1',
                        field2: 'value2',
                        field3: 'value3',
                    },
                };

                expect(selectors.getFieldsForPreview(state, 'form data')).toEqual(['value1', 'value2', 'value3']);
            });

            it('should return all fields replacing editedFieldName by formData', () => {
                const state = {
                    list: ['field1', 'field2', 'field3'],
                    byName: {
                        field1: 'value1',
                        field2: 'value2',
                        field3: 'value3',
                    },
                };

                expect(selectors.getFieldsForPreview({ ...state, editedFieldName: 'field1' }, 'form data'))
                    .toEqual(['form data', 'value2', 'value3']);

                expect(selectors.getFieldsForPreview({ ...state, editedFieldName: 'field2' }, 'form data'))
                    .toEqual(['value1', 'form data', 'value3']);

                expect(selectors.getFieldsForPreview({ ...state, editedFieldName: 'field3' }, 'form data'))
                    .toEqual(['value1', 'value2', 'form data']);
            });
        }); describe('getCollectionFields', () => {
            it('should return the model', () => {
                expect(selectors.getCollectionFields({
                    list: ['first', 'second'],
                    byName: {
                        first: { name: 'first', foo: 'bar', cover: 'collection' },
                        second: { name: 'second', foo: 'bar2', cover: 'dataset' },
                    },
                })).toEqual([{ name: 'first', foo: 'bar', cover: 'collection' }]);
            });
        });

        describe('getDatasetFields', () => {
            it('should return the model', () => {
                expect(selectors.getDatasetFields({
                    list: ['first', 'second'],
                    byName: {
                        first: { name: 'first', foo: 'bar', cover: 'collection' },
                        second: { name: 'second', foo: 'bar2', cover: 'dataset' },
                    },
                })).toEqual([{ name: 'second', foo: 'bar2', cover: 'dataset' }]);
            });
        });

        describe('hasPublishedDataset', () => {
            it('should return true if published', () => {
                expect(selectors.hasPublishedDataset({ published: true })).toEqual(true);
            });
            it('should return false if published', () => {
                expect(selectors.hasPublishedDataset({ published: false })).toEqual(false);
            });
        });

        describe('getTitleFieldName', () => {
            it('should return field name of field with title scheme and cover collection', () => {
                const state = {
                    list: ['dataset title', 'title', 'other'],
                    byName: {
                        'dataset title': { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                        title: { cover: 'collection', scheme: TITLE_SCHEME, name: 'title' },
                        other: { cover: 'collection', scheme: 'other scheme', name: 'other' },
                    },
                };
                expect(selectors.getTitleFieldName(state)).toBe('title');
            });

            it('should return field name of field with a label matching title', () => {
                const state = {
                    list: ['dataset title', 'title', 'other'],
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
                expect(selectors.getTitleFieldName(state)).toBe('title');
            });

            it('should return null if no field found', () => {
                const state = {
                    list: ['dataset title', 'title', 'other'],
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
                expect(selectors.getTitleFieldName(state)).toBe(null);
            });
        });

        describe('getContributionFields', () => {
            it('should return fields with contribution true', () => {
                const state = {
                    list: ['field1', 'field2', 'field3', 'field4'],
                    byName: {
                        field1: { name: 'field1' },
                        field2: { name: 'field2', contribution: true },
                        field3: { name: 'field3' },
                        field4: { name: 'field4', contribution: true },
                    },
                };

                expect(selectors.getContributionFields(state)).toEqual([
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
                expect(selectors.isFieldEdited({ editedValueFieldName: 'name' }, 'name'))
                    .toBe(true);
            });

            it('should return false if given fieldname is different from editedValueFieldName', () => {
                expect(selectors.isFieldEdited({ editedValueFieldName: 'name' }, 'no name'))
                    .toBe(false);
            });
        });

        describe('isFieldConfigured', () => {
            it('should return true if given fieldname is equal to configuredFieldName', () => {
                expect(selectors.isFieldConfigured({ configuredFieldName: 'name' }, 'name'))
                    .toBe(true);
            });

            it('should return false if given fieldname is different from configuredFieldName', () => {
                expect(selectors.isFieldConfigured({ configuredFieldName: 'name' }, 'no name'))
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

            expect(selectors.getFieldToAdd(state)).toEqual({ field: 'data' });
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

            expect(selectors.getFieldToAdd(state)).toEqual({
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

            expect(selectors.getFieldToAdd(state)).toEqual({ cover: 'document' });
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

            expect(selectors.getFieldToAdd(state)).toBe(null);
        });
    });
});
