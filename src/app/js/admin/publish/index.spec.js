import expect from 'expect';
import reducer, {
    defaultState,
    getPublishRequest,
    publish,
    publishSuccess,
    publishError,
} from './';

describe('publication reducer', () => {
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
            error,
        });
    });

    describe('getPublishRequest', () => {
        it('should return the correct request', () => {
            const request = getPublishRequest({ user: { token: 'test' } });
            expect(request).toEqual({
                url: '/api/publish',
                method: 'POST',
                credentials: 'include',
                headers: {
                    Accept: 'application/json',
                    Authorization: 'Bearer test',
                    'Content-Type': 'application/json',
                },
            });
        });
    });
});
