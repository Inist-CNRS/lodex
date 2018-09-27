import expect from 'expect';

import reducer, { updateProgress, errorProgress } from './reducer';
import { publish } from '../publish';
import { PENDING } from '../../../../common/progressStatus';

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
                    }),
                ),
            ).toEqual({
                status: 'status',
                target: 'target',
                progress: 'progress',
                error: undefined,
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

    describe('ERROR_PROGRESS', () => {
        it('should set error in progress', () => {
            const state = {};

            expect(reducer(state, errorProgress({ error: 'error' }))).toEqual({
                error: 'error',
                status: PENDING,
                progress: undefined,
                target: undefined,
            });
        });
    });
});
