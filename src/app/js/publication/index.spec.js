import expect from 'expect';
import reducer, {
    defaultState,
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
        const action = loadPublicationSuccess({ published: true, model: [] });
        const state = reducer({ loading: true, error: true, published: false }, action);
        expect(state).toEqual({
            error: null,
            loading: false,
            published: true,
            model: [],
        });
    });

    it('should handle the LOAD_PUBLICATION_ERROR action', () => {
        const state = reducer({ loading: true }, loadPublicationError(new Error('foo')));
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });
});
