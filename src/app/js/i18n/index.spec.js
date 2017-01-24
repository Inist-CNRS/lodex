import expect from 'expect';
import reducer, {
    defaultState,
    setLanguage,
    setLanguageSuccess,
    setLanguageError,
} from './';

describe('i18n reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the SET_LANGUAGE_REQUEST action', () => {
        const state = reducer(undefined, setLanguage());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the SET_LANGUAGE_REQUEST_SUCCESS action', () => {
        const state = reducer({ loading: true }, setLanguageSuccess('foo'));
        expect(state).toEqual({
            loading: false,
            language: 'foo',
        });
    });

    it('should handle the SET_LANGUAGE_REQUEST_ERROR action', () => {
        const error = new Error('foo');
        const state = reducer({ loading: true }, setLanguageError(error));
        expect(state).toEqual({
            loading: false,
            error,
        });
    });
});
