import { call, select, put } from 'redux-saga/effects';

import { handleStartProgressSaga } from './sagas';
import { fromUser } from '../../../../src/app/js/sharedSelectors';
import fetchSaga from '../../../../src/app/js/lib/sagas/fetchSaga';
import {
    updateProgress,
    loadProgress,
    errorProgress,
    finishProgress,
} from './reducer';
import { ProgressStatus } from '@lodex/common';

describe('progress sagas handleStartProgressSaga', () => {
    it('should get progress and trigger loadProgress action', () => {
        const it = handleStartProgressSaga();
        it.next();
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        // @ts-expect-error TS2345
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        // @ts-expect-error TS2345
        expect(it.next({ response: 'progress data' }).value).toEqual(
            put(updateProgress('progress data')),
        );
        expect(it.next().value).toEqual(put(loadProgress()));
        expect(it.next()).toEqual({ value: undefined, done: true });
    });

    it('should trigger finishProgress action if response.status is PENDING', () => {
        const it = handleStartProgressSaga();
        it.next();
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        // @ts-expect-error TS2345
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        expect(
            // @ts-expect-error TS2345
            it.next({ response: { status: ProgressStatus.PENDING } }).value,
        ).toEqual(put(updateProgress({ status: ProgressStatus.PENDING })));
        expect(it.next().value).toEqual(put(finishProgress()));
        expect(it.next()).toEqual({ value: undefined, done: true });
    });

    it('should not trigger loadProgress action if request returned an error', () => {
        const it = handleStartProgressSaga();
        it.next();
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        // @ts-expect-error TS2345
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        // @ts-expect-error TS2345
        expect(it.next({ error: 'error' }).value).toEqual(
            put(errorProgress('error')),
        );
        expect(it.next()).toEqual({ value: undefined, done: true });
    });
});
