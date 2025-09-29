import { dumpDatasetError, dumpDatasetSuccess } from '.';
import streamFile from '../../lib/streamFile';
import fetchSaga from '../../lib/sagas/fetchSaga';
import { fromUser } from '../../sharedSelectors';
import { handleDumpDatasetRequest } from './sagas';
import { call, select, put } from 'redux-saga/effects';

describe('dump sagas', () => {
    describe('handleDumpDatasetRequest', () => {
        it('should send dump dataset request and call dumpDatasetSuccess when successful', () => {
            const saga = handleDumpDatasetRequest({
                payload: ['field1', 'field2', 'field3'],
            });

            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getDumpDatasetRequest, [
                    'field1',
                    'field2',
                    'field3',
                ]),
            );

            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request', [], 'stream'),
            );

            expect(
                saga.next({ response: 'response', filename: 'filename' }).value,
            ).toEqual(call(streamFile, 'response', 'filename'));

            expect(saga.next().value).toEqual(put(dumpDatasetSuccess()));
            expect(saga.next().done).toBe(true);
        });

        it('should send dump dataset request and call dumpDatasetError when an error occurs', () => {
            const saga = handleDumpDatasetRequest({
                payload: ['field1', 'field2', 'field3'],
            });

            expect(saga.next().value).toEqual(
                // @ts-expect-error TS2339
                select(fromUser.getDumpDatasetRequest, [
                    'field1',
                    'field2',
                    'field3',
                ]),
            );

            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request', [], 'stream'),
            );
            expect(
                saga.next({ response: 'response', filename: 'filename' }).value,
            ).toEqual(call(streamFile, 'response', 'filename'));

            const error = new Error('Boom');
            expect(saga.throw(error).value).toEqual(
                put(dumpDatasetError(error)),
            );
            expect(saga.next().done).toBe(true);
        });
    });
});
