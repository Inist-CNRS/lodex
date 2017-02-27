import expect from 'expect';
import reducer, {
    defaultState,
    selectors,
    addFieldSuccess,
    editField,
    loadFieldError,
    loadFieldSuccess,
    removeField,
    updateFieldSuccess,
} from './';

describe('field reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    describe('addField', () => {
        it('should handle the ADD_FIELD_SUCCESS action', () => {
            const state = reducer({
                byName: {
                    name1: { name: 'name1', label: 'foo' },
                    name2: { name: 'name2', label: 'bar' },
                },
                list: ['name1', 'name2'],
            }, addFieldSuccess({ name: 'new_name', label: 'i am new' }));

            expect(state).toEqual({
                ...state,
                editedFieldName: 'new_name',
                list: ['name1', 'name2', 'new_name'],
                byName: {
                    name2: { name: 'name2', label: 'bar' },
                    name1: { name: 'name1', label: 'foo' },
                    new_name: { name: 'new_name', label: 'i am new' },
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

    describe('removeField', () => {
        it('should handle the REMOVE_FIELD action', () => {
            const state = reducer({
                list: ['bar', 'foo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                },
            }, removeField({ name: 'foo' }));
            expect(state).toEqual({
                list: ['bar'],
                byName: {
                    bar: { name: 'bar' },
                },
            });
        });
    });

    describe('updateFieldSuccess', () => {
        it('should handle the UPDATE_FIELD_SUCCESS action', () => {
            const state = reducer({
                list: ['bar', 'foo', 'boo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo' },
                    boo: { name: 'boo' },
                },
            }, updateFieldSuccess({ name: 'foo', updated: true }));

            expect(state).toEqual({
                list: ['bar', 'foo', 'boo'],
                byName: {
                    bar: { name: 'bar' },
                    foo: { name: 'foo', updated: true },
                    boo: { name: 'boo' },
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
    });
});
