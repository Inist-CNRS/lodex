import expect from 'expect';
import reducer, {
    defaultState,
    loadParsingResult,
    loadParsingResultError,
    loadParsingResultSuccess,
} from './reducers';

describe('parsing reducer', () => {
    it('should initialize with correct state', () => {
        const state = reducer(undefined, { type: '@@INIT' });
        expect(state).toEqual(defaultState);
    });

    it('should handle the LOAD_PARSING_RESULT action', () => {
        const state = reducer(undefined, loadParsingResult());
        expect(state).toEqual({
            ...state,
            loading: true,
        });
    });

    it('should handle the LOAD_PARSING_RESULT_ERROR action', () => {
        const state = reducer({ ...defaultState, loading: true }, loadParsingResultError('foo'));
        expect(state).toEqual({
            ...defaultState,
            loading: false,
            error: 'foo',
        });
    });

    it('should handle the LOAD_PARSING_RESULT_SUCCESS action', () => {
        const state = reducer({ ...defaultState, loading: true }, loadParsingResultSuccess({ parsing: true }));
        expect(state).toEqual({
            ...defaultState,
            loading: false,
            parsing: true,
        });
    });
});
