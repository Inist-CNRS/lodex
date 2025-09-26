import reducer, {
    defaultState,
    uploadFile,
    uploadError,
    uploadSuccess,
    openUpload,
    closeUpload,
} from './';

describe('upload reduce', () => {
    it('should return defaultState when no state', () => {
        expect(reducer(undefined, { type: 'OTHER_ACTION' })).toEqual(
            defaultState,
        );
    });

    it('should set status to PENDING and to error false on UPLOAD_FILE with a file', () => {
        expect(reducer({ state: 'value' }, uploadFile({}))).toEqual({
            state: 'value',
            error: false,
            status: 'PENDING',
            open: false,
        });
    });

    it('should return state as is on UPLOAD_FILE without a file (cancel file selection dialog)', () => {
        expect(reducer({ state: 'value' }, uploadFile())).toEqual({
            state: 'value',
        });
    });

    it('should set status to SUCCESS on UPLOAD_SUCCESS', () => {
        expect(reducer({ state: 'value' }, uploadSuccess())).toEqual({
            state: 'value',
            status: 'SUCCESS',
        });
    });

    it('should set status to ERROR and error to action.payload on UPLOAD_FILE_ERROR', () => {
        expect(
            reducer({ state: 'value' }, uploadError(new Error('boom'))),
        ).toEqual({
            state: 'value',
            status: 'ERROR',
            error: 'boom',
        });
    });

    it('should handle openUpload', () => {
        expect(reducer({ state: 'value' }, openUpload())).toEqual({
            state: 'value',
            open: true,
        });
    });

    it('should handle closeUpload', () => {
        expect(reducer({ state: 'value' }, closeUpload())).toEqual({
            state: 'value',
            open: false,
        });
    });
});
