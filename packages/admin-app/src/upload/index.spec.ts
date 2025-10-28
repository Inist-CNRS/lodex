import type { Action } from 'redux-actions';
import reducer, {
    defaultState,
    uploadFile,
    uploadError,
    uploadSuccess,
    openUpload,
    closeUpload,
} from './index';

describe('upload reduce', () => {
    it('should return defaultState when no state', () => {
        expect(
            reducer(undefined, { type: 'OTHER_ACTION' } as Action<unknown>),
        ).toEqual(defaultState);
    });

    it('should set status to PENDING and to error false on UPLOAD_FILE with a file', () => {
        expect(reducer(defaultState, uploadFile({}))).toEqual({
            ...defaultState,
            error: false,
            status: 'PENDING',
            open: false,
        });
    });

    it('should return state as is on UPLOAD_FILE without a file (cancel file selection dialog)', () => {
        expect(reducer(defaultState, uploadFile(null))).toEqual(defaultState);
    });

    it('should set status to SUCCESS on UPLOAD_SUCCESS', () => {
        expect(reducer(defaultState, uploadSuccess())).toEqual({
            ...defaultState,
            status: 'SUCCESS',
        });
    });

    it('should set status to ERROR and error to action.payload on UPLOAD_FILE_ERROR', () => {
        expect(reducer(defaultState, uploadError(new Error('boom')))).toEqual({
            ...defaultState,
            status: 'ERROR',
            error: 'boom',
        });
    });

    it('should handle openUpload', () => {
        expect(reducer(defaultState, openUpload())).toEqual({
            ...defaultState,
            open: true,
        });
    });

    it('should handle closeUpload', () => {
        expect(reducer(defaultState, closeUpload())).toEqual({
            ...defaultState,
            open: false,
        });
    });
});
