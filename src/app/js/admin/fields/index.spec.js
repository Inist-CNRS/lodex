import expect from 'expect';
import reducer, {
    defaultState,
    selectors,
    addField,
    editField,
    loadFieldError,
    loadFieldSuccess,
    removeFieldSuccess,
    saveFieldSuccess,
    getLineColGetterFromAllFields,
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
                    },
                },
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

    describe('saveFieldSuccess', () => {
        it('should handle the SAVE_FIELD_SUCCESS action', () => {
            const state = reducer({
                list: ['bar', 'foo', 'boo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                    boo: { name: 'boo' },
                },
                editedFieldName: 'foo',
            }, saveFieldSuccess({ name: 'foo', updated: true }));

            expect(state).toEqual({
                list: ['bar', 'foo', 'boo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo', updated: true },
                    boo: { name: 'boo' },
                },
                editedFieldName: null,
            });
        });

        it('should handle the SAVE_FIELD_SUCCESS action with new editedField', () => {
            const state = reducer({
                list: ['bar', 'foo', 'boo', 'new'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                    boo: { name: 'boo' },
                    new: { name: 'new' },
                },
                editedFieldName: 'new',
            }, saveFieldSuccess({ name: 'new_name', updated: true }));

            expect(state).toEqual({
                list: ['bar', 'foo', 'boo', 'new_name'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                    boo: { name: 'boo' },
                    new_name: { name: 'new_name', updated: true },
                },
                editedFieldName: null,
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
        });
    });
});
