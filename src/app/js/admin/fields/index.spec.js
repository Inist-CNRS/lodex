import expect from 'expect';
import reducer, {
    defaultState,
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
                byId: {
                    id1: { _id: 'id1', name: 'foo' },
                    id2: { _id: 'id2', name: 'bar' },
                },
                list: ['id1', 'id2'],
            }, addFieldSuccess({ _id: 'new_id', name: 'i am new' }));

            expect(state).toEqual({
                ...state,
                editedFieldId: 'new_id',
                list: ['id1', 'id2', 'new_id'],
                byId: {
                    id1: { _id: 'id1', name: 'foo' },
                    id2: { _id: 'id2', name: 'bar' },
                    new_id: { _id: 'new_id', name: 'i am new' },
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
                { _id: 'bar_id', foo: 'bar' },
                { _id: 'foo_id', foo: 'foo' },
            ]));
            expect(state).toEqual({
                ...defaultState,
                list: ['bar_id', 'foo_id'],
                byId: {
                    bar_id: { _id: 'bar_id', foo: 'bar' },
                    foo_id: { _id: 'foo_id', foo: 'foo' },
                },
            });
        });
    });

    describe('editField', () => {
        it('should handle the EDIT_FIELD action', () => {
            const state = reducer({ ...defaultState }, editField(42));
            expect(state).toEqual({
                ...defaultState,
                editedFieldId: 42,
            });
        });
    });

    describe('removeField', () => {
        it('should handle the REMOVE_FIELD action', () => {
            const state = reducer({
                list: ['bar', 'foo'],
                byId: {
                    bar: { _id: 'bar' },
                    foo: { _id: 'foo' },
                },
            }, removeField({ _id: 'foo' }));
            expect(state).toEqual({
                list: ['bar'],
                byId: {
                    bar: { _id: 'bar' },
                },
            });
        });
    });

    describe('updateFieldSuccess', () => {
        it('should handle the UPDATE_FIELD_SUCCESS action', () => {
            const state = reducer({
                list: ['bar', 'foo', 'boo'],
                byId: {
                    bar: { _id: 'bar' },
                    foo: { _id: 'foo' },
                    boo: { _id: 'boo' },
                },
            }, updateFieldSuccess({ _id: 'foo', updated: true }));

            expect(state).toEqual({
                list: ['bar', 'foo', 'boo'],
                byId: {
                    bar: { _id: 'bar' },
                    foo: { _id: 'foo', updated: true },
                    boo: { _id: 'boo' },
                },
            });
        });
    });
});
