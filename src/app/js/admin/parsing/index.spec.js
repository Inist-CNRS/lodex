import expect from 'expect';
import reducer, {
    defaultState,
    getParsedExcerptColumns,
    hasUploadedFile,
    loadParsingResult,
    loadParsingResultError,
    loadParsingResultSuccess,
    reloadParsingResult,
    cancelReload,
} from './';

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
            allowUpload: true,
            error: 'foo',
        });
    });

    it('should handle the LOAD_PARSING_RESULT_SUCCESS action', () => {
        const state = reducer({ ...defaultState, loading: true }, loadParsingResultSuccess({ parsing: true }));
        expect(state).toEqual({
            ...defaultState,
            allowUpload: false,
            loading: false,
            parsing: true,
        });
    });

    it('should handle the RELOAD_PARSING_RESULT action', () => {
        const state = reducer({ ...defaultState, allowUpload: false }, reloadParsingResult());
        expect(state).toEqual({
            ...defaultState,
            allowUpload: true,
        });
    });

    it('should handle the CANCEL_RELOAD action', () => {
        const state = reducer({ ...defaultState, allowUpload: true }, cancelReload());
        expect(state).toEqual({
            ...defaultState,
            allowUpload: false,
        });
    });

    describe('getParsedExcerptColumns', () => {
        it('should return an empty array if no excerptLines in state', () => {
            expect(getParsedExcerptColumns({ excerptLines: [] })).toEqual([]);
        });

        it('should return a list of columns from excerptLines', () => {
            expect(getParsedExcerptColumns({ excerptLines: [{
                key1: 'key1_value',
                key2: 'key2_value',
                key3: 'key3_value',
            }] })).toEqual(['key1', 'key2', 'key3']);
        });
    });

    describe('hasUploadedFile', () => {
        it('should return true if totalLoadedLines is truthy', () => {
            expect(hasUploadedFile({ totalLoadedLines: 100 })).toEqual(true);
        });

        it('should return true if totalLoadedLines is falsy', () => {
            expect(hasUploadedFile({ totalLoadedLines: 0 })).toEqual(false);
        });
    });
});
