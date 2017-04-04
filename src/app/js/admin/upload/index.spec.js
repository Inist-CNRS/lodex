import expect from 'expect';

import reducer, {
    defaultState,
    UPLOAD_FILE,
    UPLOAD_FILE_ERROR,
    UPLOAD_FILE_SUCCESS,
} from './';

describe('upload reduce', () => {
    it('should return defaultState when no state', () => {
        expect(reducer(undefined, {
            type: 'OTHER_ACTION',
        }))
        .toEqual(defaultState);
    });

    it('should set status to PENDING and to error false on UPLOAD_FILE with a file', () => {
        expect(reducer({
            state: 'value',
        }, {
            type: UPLOAD_FILE,
            payload: {},
        }))
        .toEqual({
            state: 'value',
            error: false,
            status: 'PENDING',
        });
    });


    it('should return state as is on UPLOAD_FILE without a file (cancel file selection dialog)', () => {
        expect(reducer({
            state: 'value',
        }, {
            type: UPLOAD_FILE,
        }))
        .toEqual({
            state: 'value',
        });
    });

    it('should set status to SUCCESS on UPLOAD_FILE_SUCCESS', () => {
        expect(reducer({
            state: 'value',
        }, {
            type: UPLOAD_FILE_SUCCESS,
        }))
        .toEqual({
            state: 'value',
            status: 'SUCCESS',
        });
    });

    it('should set status to ERROR and error to action.payload on UPLOAD_FILE_ERROR', () => {
        expect(reducer({
            state: 'value',
        }, {
            type: UPLOAD_FILE_ERROR,
            payload: new Error('boom'),
        }))
        .toEqual({
            state: 'value',
            status: 'ERROR',
            error: 'boom',
        });
    });
});
