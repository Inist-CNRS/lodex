import expect from 'expect';

import TITLE_SCHEME from '../../../../common/titleScheme';

import reducer, {
    defaultState,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
    selectField,
    fromPublication,
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
            fields: ['bar'],
            published: true,
        });
        const state = reducer({ loading: true, error: true, published: false }, action);

        expect(state).toEqual({
            error: null,
            fields: ['bar'],
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
                fields: [
                    { foo: 'bar', cover: 'collection' },
                    { foo: 'bar2', cover: 'dataset' },
                ],
            })).toEqual([{ foo: 'bar', cover: 'collection' }]);
        });
    });

    describe('getDatasetFields', () => {
        it('should return the model', () => {
            expect(fromPublication.getDatasetFields({
                fields: [
                    { foo: 'bar', cover: 'collection' },
                    { foo: 'bar2', cover: 'dataset' },
                ],
            })).toEqual([{ foo: 'bar2', cover: 'dataset' }]);
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
                fields: [
                    { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                    { cover: 'collection', scheme: TITLE_SCHEME, name: 'title' },
                    { cover: 'collection', scheme: 'other scheme', name: 'other' },
                ],
            };
            expect(fromPublication.getTitleFieldName(state)).toBe('title');
        });

        it('should return null if no field found', () => {
            const state = {
                fields: [
                    { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                    { cover: 'collection', scheme: 'other scheme', name: 'title' },
                    { cover: 'collection', scheme: 'other scheme', name: 'other' },
                ],
            };
            expect(fromPublication.getTitleFieldName(state)).toBe(null);
        });
    });

    describe('getContributionFields', () => {
        it('should return fields with contribution true', () => {
            const state = {
                fields: [
                    { fieldName: 'field1' },
                    { fieldName: 'field2', contribution: true },
                    { fieldName: 'field3' },
                    { fieldName: 'field4', contribution: true },
                ],
            };

            expect(fromPublication.getContributionFields(state)).toEqual([
                { fieldName: 'field2', contribution: true },
                { fieldName: 'field4', contribution: true },
            ]);
        });
    });
});
