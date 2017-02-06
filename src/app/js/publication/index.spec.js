import expect from 'expect';
import reducer, {
    defaultState,
    getCollectionFields,
    getLoadPublicationRequest,
    hasPublishedDataset,
    loadPublication,
    loadPublicationSuccess,
    loadPublicationError,
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
            characteristics: ['foo'],
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

    describe('hasPublishedDataset', () => {
        it('should return true if published', () => {
            expect(hasPublishedDataset({ publication: { published: true } })).toEqual(true);
        });
        it('should return false if published', () => {
            expect(hasPublishedDataset({ publication: { published: false } })).toEqual(false);
        });
    });
});
