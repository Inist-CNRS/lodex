import expect from 'expect';
import reducer, {
    defaultState,
    publish,
    publishSuccess,
    publishError,
} from './';

describe('publish reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the PUBLISH action', () => {
        const state = reducer(undefined, publish());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the PUBLISH_SUCCESS action', () => {
        const state = reducer({ loading: true, error: true }, publishSuccess('foo'));
        expect(state).toEqual({
            error: null,
            loading: false,
        });
    });

    it('should handle the PUBLISH_ERROR action', () => {
        const error = new Error('foo');
        const state = reducer({ loading: true }, publishError(error));
        expect(state).toEqual({
            loading: false,
            error: 'foo',
        });
    });
});
