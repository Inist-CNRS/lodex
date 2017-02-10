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
                list: [{ name: 'foo' }, { name: 'bar' }],
            }, addFieldSuccess({ name: 'i am new' }));

            expect(state).toEqual({
                ...state,
                editedFieldIndex: 2,
                list: [{ name: 'foo' }, { name: 'bar' }, { name: 'i am new' }],
            });
        });
    });

    describe('loadFile', () => {
        it('should handle the LOAD_FIELD_ERROR action', () => {
            const state = reducer({ ...defaultState }, loadFieldError('foo'));
            expect(state).toEqual(defaultState);
        });

        it('should handle the LOAD_FIELD_SUCCESS action', () => {
            const state = reducer({ ...defaultState, list: ['foo'] }, loadFieldSuccess([{ foo: 'bar' }]));
            expect(state).toEqual({
                ...defaultState,
                list: [{ foo: 'bar' }],
            });
        });
    });

    describe('editField', () => {
        it('should handle the EDIT_FIELD action', () => {
            const state = reducer({ ...defaultState }, editField(42));
            expect(state).toEqual({
                ...defaultState,
                editedFieldIndex: 42,
            });
        });
    });

    describe('removeField', () => {
        it('should handle the REMOVE_FIELD action', () => {
            const state = reducer({ list: [{ _id: 'bar' }, { _id: 'foo' }] }, removeField({ _id: 'foo' }));
            expect(state).toEqual({
                list: [{ _id: 'bar' }],
            });
        });
    });

    describe('updateFieldSuccess', () => {
        it('should handle the UPDATE_FIELD_SUCCESS action', () => {
            const state = reducer({
                list: [{ _id: 'bar' }, { _id: 'foo' }, { _id: 'boo' }],
            }, updateFieldSuccess({ _id: 'foo', updated: true }));

            expect(state).toEqual({
                list: [{ _id: 'bar' }, { _id: 'foo', updated: true }, { _id: 'boo' }],
            });
        });
    });
});
