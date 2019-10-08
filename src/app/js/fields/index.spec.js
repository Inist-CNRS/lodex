import reducer, {
    defaultState,
    addField,
    editField,
    loadFieldError,
    loadFieldSuccess,
    removeFieldSuccess,
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
    addCharacteristicSuccess,
    fieldInvalid,
    changePositionValue,
} from './';

import { addFieldToResourceSuccess } from '../public/resource';

describe('field reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    describe('addField', () => {
        it('should handle the ADD_FIELD action with no name', () => {
            const state = reducer(
                {
                    byName: {
                        name1: { name: 'name1', label: 'foo' },
                        name2: { name: 'name2', label: 'bar' },
                    },
                    list: ['name1', 'name2'],
                },
                addField(),
            );

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
            const state = reducer(
                {
                    byName: {
                        name1: { name: 'name1', label: 'foo' },
                        name2: { name: 'name2', label: 'bar' },
                    },
                    list: ['name1', 'name2'],
                },
                addField('target_col'),
            );

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
                        display_in_resource: true,
                        searchable: true,
                        transformers: [
                            {
                                operation: 'COLUMN',
                                args: [
                                    {
                                        name: 'column',
                                        type: 'column',
                                        value: 'target_col',
                                    },
                                ],
                            },
                        ],
                        position: 2,
                        overview: 0,
                        classes: [],
                    },
                },
            });
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
            const state = reducer(
                { loading: true, error: true, published: false },
                action,
            );

            expect(state).toEqual({
                error: null,
                list: ['bar'],
                byName: {
                    bar: {
                        name: 'bar',
                        value: 'data',
                    },
                },
                loading: false,
                published: true,
                editedValueFieldName: null,
            });
        });

        it('should handle the LOAD_PUBLICATION_ERROR action', () => {
            const state = reducer(
                { loading: true },
                loadPublicationError(new Error('foo')),
            );
            expect(state).toEqual({
                loading: false,
                error: 'foo',
            });
        });

        it('should handle the SELECT_FIELD action', () => {
            const state = reducer(
                { data: 'value' },
                selectField('selectedFieldName'),
            );
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
                invalidProperties: [],
            });
        });

        it('should handle the CONFIGURE_FIELD_SUCCESS action', () => {
            const state = reducer(
                { data: 'value', byName: {} },
                configureFieldSuccess({
                    field: { name: 'name', data: 'updated' },
                }),
            );
            expect(state).toEqual({
                data: 'value',
                byName: {
                    name: { name: 'name', data: 'updated' },
                },
                invalidProperties: [],
                isSaving: false,
                error: null,
                configuredFieldName: null,
            });
        });

        it('should handle the CONFIGURE_FIELD_ERROR action', () => {
            const state = reducer(
                { data: 'value' },
                configureFieldError({ message: 'Boom' }),
            );
            expect(state).toEqual({
                data: 'value',
                error: 'Boom',
                isSaving: false,
            });
        });

        it('should handle the CONFIGURE_FIELD_OPEN action', () => {
            const state = reducer(
                { data: 'value' },
                configureFieldOpen('fieldName'),
            );
            expect(state).toEqual({
                data: 'value',
                configuredFieldName: 'fieldName',
                error: null,
            });
        });

        it('should handle the CONFIGURE_FIELD_CANCEL action', () => {
            const state = reducer({ data: 'value' }, configureFieldCancel());
            expect(state).toEqual({
                invalidProperties: [],
                data: 'value',
                configuredFieldName: null,
                error: null,
            });
        });

        it('should handle the OPEN_FIELD_VALUE action', () => {
            const state = reducer(
                { data: 'value' },
                openEditFieldValue('fieldName'),
            );
            expect(state).toEqual({
                data: 'value',
                editedValueFieldName: 'fieldName',
                error: null,
            });
        });

        it('should handle the CLOSE_EDIT_FIELD_VALUE action', () => {
            const state = reducer(
                { data: 'value' },
                closeEditFieldValue('fieldName'),
            );
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
            const state = reducer(
                { ...defaultState, list: ['foo'] },
                loadFieldSuccess([
                    { name: 'bar_name', foo: 'bar' },
                    { name: 'foo_name', foo: 'foo' },
                ]),
            );
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
            const state = reducer(
                {
                    list: ['name1', 'name2', 'name3'],
                },
                editField(1),
            );
            expect(state).toEqual({
                list: ['name1', 'name2', 'name3'],
                editedFieldName: 'name2',
            });
        });
    });

    describe('removeFieldSuccess', () => {
        it('should handle the REMOVE_FIELD_SUCCESS action', () => {
            const state = reducer(
                {
                    list: ['bar', 'foo'],
                    byName: {
                        bar: { name: 'bar' },
                        foo: { name: 'foo' },
                    },
                },
                removeFieldSuccess({ name: 'foo' }),
            );
            expect(state).toEqual({
                list: ['bar'],
                byName: {
                    bar: { name: 'bar' },
                },
            });
        });
    });

    describe('addCharacteristicSuccess, addFieldToResourceSuccess', () => {
        it('should add payload.field to byName and list', () => {
            [addCharacteristicSuccess, addFieldToResourceSuccess].forEach(
                action => {
                    const state = reducer(
                        {
                            byName: {
                                field: 'data',
                            },
                            list: ['field'],
                        },
                        action({ field: { name: 'newField', data: 'data' } }),
                    );
                    expect(state).toEqual({
                        invalidProperties: [],
                        byName: {
                            field: 'data',
                            newField: {
                                name: 'newField',
                                data: 'data',
                            },
                        },
                        list: ['field', 'newField'],
                        isAdding: false,
                        isSaving: false,
                        error: null,
                    });
                },
            );
        });

        it('should update payload.field in byName and not touch list if field was already present', () => {
            [addCharacteristicSuccess, addFieldToResourceSuccess].forEach(
                action => {
                    const state = reducer(
                        {
                            byName: {
                                field: { data: 'data' },
                            },
                            list: ['field'],
                        },
                        action({
                            field: { name: 'field', data: 'updated data' },
                        }),
                    );
                    expect(state).toEqual({
                        invalidProperties: [],
                        byName: {
                            field: {
                                name: 'field',
                                data: 'updated data',
                            },
                        },
                        list: ['field'],
                        isAdding: false,
                        isSaving: false,
                        error: null,
                    });
                },
            );
        });
    });

    describe('fieldInvalid', () => {
        it('should pass invalidProperties to state and set isSaving to false', () => {
            const state = reducer(
                { foo: 'bar' },
                fieldInvalid({ invalidProperties: 'invalid properties' }),
            );

            expect(state).toEqual({
                foo: 'bar',
                isSaving: false,
                invalidProperties: 'invalid properties',
            });
        });
    });

    describe('CHANGE_POSITION_VALUE', () => {
        const state = reducer(
            {
                foo: 'bar',
                byName: {
                    a: { position: 1 },
                    b: { position: 2 },
                    c: { position: 3 },
                },
            },
            changePositionValue({
                fields: [
                    { name: 'a', position: 2 },
                    { name: 'b', position: 1 },
                ],
            }),
        );

        expect(state).toEqual({
            foo: 'bar',
            byName: {
                a: { position: 2 },
                b: { position: 1 },
                c: { position: 3 },
            },
        });
    });
});
