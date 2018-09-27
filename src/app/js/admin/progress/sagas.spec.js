import expect from 'expect';

import { handleStartProgressSaga } from './sagas';
import { call, select, put } from 'redux-saga/effects';
import { delay } from 'redux-saga';
import { fromUser } from '../../sharedSelectors';
import fetchSaga from '../../lib/sagas/fetchSaga';
import {
    updateProgress,
    loadProgress,
    errorProgress,
    finishProgress,
} from './reducer';
import { PENDING } from '../../../../common/progressStatus';

describe('progress sagas handleStartProgressSaga', () => {
    it('should get progress and trigger loadProgress action', () => {
        const it = handleStartProgressSaga();
        expect(it.next().value).toEqual(delay(1000));
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        expect(it.next({ response: 'progress data' }).value).toEqual(
            put(updateProgress('progress data')),
        );
        expect(it.next().value).toEqual(put(loadProgress()));
        expect(it.next()).toEqual({ value: undefined, done: true });
    });

    it('should trigger finishProgress action if response.status is PENDING', () => {
        const it = handleStartProgressSaga();
        expect(it.next().value).toEqual(delay(1000));
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        expect(it.next({ response: { status: PENDING } }).value).toEqual(
            put(updateProgress({ status: PENDING })),
        );
        expect(it.next().value).toEqual(put(finishProgress()));
        expect(it.next()).toEqual({ value: undefined, done: true });
    });

    it('should not trigger loadProgress action if request returned an error', () => {
        const it = handleStartProgressSaga();
        expect(it.next().value).toEqual(delay(1000));
        expect(it.next().value).toEqual(select(fromUser.getProgressRequest));
        expect(it.next('request').value).toEqual(call(fetchSaga, 'request'));
        expect(it.next({ error: 'error' }).value).toEqual(
            put(errorProgress('error')),
        );
        expect(it.next()).toEqual({ value: undefined, done: true });
    });
});
