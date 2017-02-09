import expect from 'expect';

import TITLE_SCHEME from '../../../common/titleScheme';

import reducer, {
    defaultState,
    getCollectionFields,
    getDatasetFields,
    getLoadPublicationRequest,
    hasPublishedDataset,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
    getTitleFieldName,
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

    describe('getLoadPublicationRequest', () => {
        it('should return the correct request', () => {
            const request = getLoadPublicationRequest({ user: { token: 'test' } });
            expect(request).toEqual({
                url: '/api/publication',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer test',
                    'Content-Type': 'application/json',
                },
            });
        });
    });

    describe('getCollectionFields', () => {
        it('should return the model', () => {
            expect(getCollectionFields({
                publication: {
                    fields: [
                        { foo: 'bar', cover: 'collection' },
                        { foo: 'bar2', cover: 'dataset' },
                    ],
                },
            })).toEqual([{ foo: 'bar', cover: 'collection' }]);
        });
    });

    describe('getDatasetFields', () => {
        it('should return the model', () => {
            expect(getDatasetFields({
                publication: {
                    fields: [
                        { foo: 'bar', cover: 'collection' },
                        { foo: 'bar2', cover: 'dataset' },
                    ],
                },
            })).toEqual([{ foo: 'bar2', cover: 'dataset' }]);
        });
    });

    describe('hasPublishedDataset', () => {
        it('should return true if published', () => {
            expect(hasPublishedDataset({ publication: { published: true } })).toEqual(true);
        });
        it('should return false if published', () => {
            expect(hasPublishedDataset({ publication: { published: false } })).toEqual(false);
        });
    });

    describe('getTitleFieldName', () => {
        it('should return field name of field with title scheme and cover collection', () => {
            const state = {
                publication: {
                    fields: [
                        { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                        { cover: 'collection', scheme: TITLE_SCHEME, name: 'title' },
                        { cover: 'collection', scheme: 'other scheme', name: 'other' },
                    ],
                },
            };
            expect(getTitleFieldName(state)).toBe('title');
        });

        it('should return null if no field found', () => {
            const state = {
                publication: {
                    fields: [
                        { cover: 'dataset', scheme: TITLE_SCHEME, name: 'dataset title' },
                        { cover: 'collection', scheme: 'other scheme', name: 'title' },
                        { cover: 'collection', scheme: 'other scheme', name: 'other' },
                    ],
                },
            };
            expect(getTitleFieldName(state)).toBe(null);
        });
    });
});
