import reducer, {
    updateProgress,
    errorProgress,
    clearProgress,
} from './reducer';
import { publish } from '../publish';
import { uploadFile } from '../upload';
import { PENDING, ERROR } from '../../../../common/progressStatus';

describe('progress reducer', () => {
    describe('UPDATE_PROGRESS', () => {
        it('should update progress data', () => {
            const state = {};

            expect(
                reducer(
                    state,
                    updateProgress({
                        status: 'status',
                        target: 'target',
                        progress: 'progress',
                        symbol: 'symbol',
                    }),
                ),
            ).toEqual({
                status: 'status',
                target: 'target',
                progress: 'progress',
                error: undefined,
                symbol: 'symbol',
            });
        });
    });

    describe('PUBLISH', () => {
        it('should start progress', () => {
            const state = {};

            expect(reducer(state, publish())).toEqual({
                status: 'STARTING',
                error: undefined,
                progress: undefined,
                target: undefined,
            });
        });
    });

    describe('UPLOAD_FILE', () => {
        it('should start progress', () => {
            const state = {};

            expect(reducer(state, uploadFile())).toEqual({
                status: 'STARTING',
                error: undefined,
                progress: undefined,
                target: undefined,
            });
        });
    });

    describe('ERROR_PROGRESS', () => {
        it('should set error in progress', () => {
            const state = {};

            expect(reducer(state, errorProgress())).toEqual({
                error: true,
                status: ERROR,
                progress: undefined,
                target: undefined,
            });
        });
    });

    describe('CLEAR_PROGRESS', () => {
        it('should clear progress', () => {
            const state = {};

            expect(reducer(state, clearProgress())).toEqual({
                error: false,
                status: PENDING,
                progress: undefined,
                target: undefined,
            });
        });
    });
});
