import reducer, {
    defaultState,
    addField,
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
} from './reducer';

import { addFieldToResourceSuccess } from '../../public-app/src/resource';
import { SCOPE_DOCUMENT } from '@lodex/common';

describe('field reducer', () => {
    it('should initialize with correct state', () => {
        // @ts-expect-error TS2345
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    describe('addField', () => {
        it('should handle the ADD_FIELD action with no name', () => {
            const state = reducer(
                {
                    byName: {
                        name1: { _id: '1', name: 'name1', label: 'foo' },
                        name2: { _id: '2', name: 'name2', label: 'bar' },
                    },
                    // @ts-expect-error TS2322
                    list: ['name1', 'name2'],
                },
                addField({ name: undefined, scope: SCOPE_DOCUMENT }),
            );

            expect(state).toEqual({
                ...state,
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { _id: '2', name: 'name2', label: 'bar' },
                    name1: { _id: '1', name: 'name1', label: 'foo' },
                    new: {
                        label: 'newField 3',
                        scope: SCOPE_DOCUMENT,
                        name: 'new',
                        display: true,
                        searchable: false,
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
                        name1: { _id: '1', name: 'name1', label: 'foo' },
                        name2: { _id: '2', name: 'name2', label: 'bar' },
                    },
                    // @ts-expect-error TS2322
                    list: ['name1', 'name2'],
                },
                addField({ name: 'target_col', scope: SCOPE_DOCUMENT }),
            );

            expect(state).toEqual({
                ...state,
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { _id: '2', name: 'name2', label: 'bar' },
                    name1: { _id: '1', name: 'name1', label: 'foo' },
                    new: {
                        label: 'target_col',
                        scope: SCOPE_DOCUMENT,
                        name: 'new',
                        display: true,
                        searchable: false,
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
        it('should handle the ADD_FIELD action with no name and subresourceId', () => {
            const state = reducer(
                {
                    byName: {
                        name1: { _id: '1', name: 'name1', label: 'foo' },
                        name2: { _id: '2', name: 'name2', label: 'bar' },
                    },
                    // @ts-expect-error TS2322
                    list: ['name1', 'name2'],
                },
                addField({
                    name: undefined,
                    scope: SCOPE_DOCUMENT,
                    subresourceId: 'subresourceId',
                }),
            );

            expect(state).toEqual({
                ...state,
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { _id: '2', name: 'name2', label: 'bar' },
                    name1: { _id: '1', name: 'name1', label: 'foo' },
                    new: {
                        label: 'newField 3',
                        scope: SCOPE_DOCUMENT,
                        name: 'new',
                        display: true,
                        searchable: false,
                        transformers: [],
                        position: 2,
                        overview: 0,
                        classes: [],
                        subresourceId: 'subresourceId',
                    },
                },
            });
        });
        it('should handle the ADD_FIELD action with name and subresourcePath', () => {
            const state = reducer(
                {
                    byName: {
                        name1: { _id: '1', name: 'name1', label: 'foo' },
                        name2: { _id: '2', name: 'name2', label: 'bar' },
                    },
                    // @ts-expect-error TS2322
                    list: ['name1', 'name2'],
                },
                addField({
                    name: 'target_col',
                    scope: SCOPE_DOCUMENT,
                    subresourceId: 'subresourceId',
                    subresourcePath: 'subresourcePath',
                }),
            );

            expect(state).toEqual({
                ...state,
                list: ['name1', 'name2', 'new'],
                byName: {
                    name2: { _id: '2', name: 'name2', label: 'bar' },
                    name1: { _id: '1', name: 'name1', label: 'foo' },
                    new: {
                        label: 'target_col',
                        scope: SCOPE_DOCUMENT,
                        name: 'new',
                        display: true,
                        searchable: false,
                        transformers: [
                            {
                                operation: 'COLUMN',
                                args: [
                                    {
                                        name: 'column',
                                        type: 'column',
                                        value: 'subresourcePath',
                                    },
                                ],
                            },
                            {
                                operation: 'PARSE',
                            },
                            {
                                operation: 'GET',
                                args: [
                                    {
                                        name: 'path',
                                        type: 'string',
                                        value: 'target_col',
                                    },
                                ],
                            },
                        ],
                        position: 2,
                        overview: 0,
                        classes: [],
                        subresourceId: 'subresourceId',
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
                // @ts-expect-error TS2353
                { loading: true, error: true, published: false, byName: {} },
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

        it('should handle the LOAD_PUBLICATION_SUCCESS action with existing new field', () => {
            const action = loadPublicationSuccess({
                characteristics: ['foo'],
                fields: [{ name: 'bar', value: 'data' }],
                published: true,
            });
            const state = reducer(
                {
                    loading: true,
                    error: true,
                    published: false,
                    // @ts-expect-error TS2353
                    byName: { new: { name: 'foo', value: 'bar' } },
                },
                action,
            );

            expect(state).toEqual({
                error: null,
                list: ['bar', 'new'],
                byName: {
                    bar: {
                        name: 'bar',
                        value: 'data',
                    },
                    new: {
                        name: 'foo',
                        value: 'bar',
                    },
                },
                loading: false,
                published: true,
                editedValueFieldName: null,
            });
        });

        it('should handle the LOAD_PUBLICATION_ERROR action', () => {
            const state = reducer(
                // @ts-expect-error TS2345
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
                // @ts-expect-error TS2353
                { data: 'value' },
                selectField('selectedFieldName'),
            );
            expect(state).toEqual({
                data: 'value',
                selectedField: 'selectedFieldName',
            });
        });

        it('should handle the CONFIGURE_FIELD action', () => {
            // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
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
            // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
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
                // @ts-expect-error TS2322
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

    describe('removeFieldSuccess', () => {
        it('should handle the REMOVE_FIELD_SUCCESS action', () => {
            const state = reducer(
                {
                    // @ts-expect-error TS2322
                    list: ['bar', 'foo'],
                    byName: {
                        bar: { _id: '1', name: 'bar' },
                        foo: { _id: '2', name: 'foo' },
                    },
                },
                removeFieldSuccess({ name: 'foo' }),
            );
            expect(state).toEqual({
                list: ['bar'],
                byName: {
                    bar: { _id: '1', name: 'bar' },
                },
            });
        });
    });

    describe('addCharacteristicSuccess, addFieldToResourceSuccess', () => {
        it('should add payload.field to byName and list', () => {
            [addCharacteristicSuccess, addFieldToResourceSuccess].forEach(
                (action) => {
                    const state = reducer(
                        {
                            byName: {
                                // @ts-expect-error TS2322
                                field: 'data',
                            },
                            // @ts-expect-error TS2322
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
                (action) => {
                    const state = reducer(
                        {
                            byName: {
                                // @ts-expect-error TS2322
                                field: { data: 'data' },
                            },
                            // @ts-expect-error TS2322
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
                // @ts-expect-error TS2353
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
                // @ts-expect-error TS2353
                foo: 'bar',
                byName: {
                    a: { _id: '1', name: 'a', position: 1 },
                    b: { _id: '2', name: 'b', position: 2 },
                    c: { _id: '3', name: 'c', position: 3 },
                },
            },
            changePositionValue({
                fields: [
                    { name: 'a', position: 2 },
                    { name: 'b', position: 1 },
                ],
            }),
        );

        it('should handle CHANGE_POSITION_VALUE event', () => {
            expect(state).toEqual({
                foo: 'bar',
                byName: {
                    a: { _id: '1', name: 'a', position: 2 },
                    b: { _id: '2', name: 'b', position: 1 },
                    c: { _id: '3', name: 'c', position: 3 },
                },
            });
        });
    });
});
