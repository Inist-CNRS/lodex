import expect from 'expect';

import TITLE_SCHEME from '../../../../common/titleScheme';

import reducer, {
    defaultState,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
    selectField,
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
});
