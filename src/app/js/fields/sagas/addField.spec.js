import { put } from 'redux-saga/effects';

import { handleAddField } from './addField';

describe('fields saga', () => {
    describe('handleAddField', () => {
        it('should redirect to edited field if filter is defined', () => {
            const saga = handleAddField({
                payload: { scope: 'bar' },
            });
            expect(saga.next().value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/bar/edit/new'],
                        method: 'push',
                    },
                }),
            );
        });
    });
});
