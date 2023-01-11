import { put } from 'redux-saga/effects';

import { handleAddField } from './addField';

describe('fields saga', () => {
    describe('handleEditField', () => {
        it('should redirect to edited field if filter is defined', () => {
            const saga = handleAddField({
                payload: { filter: 'bar' },
            });
            expect(saga.next().value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/bar/edit'],
                        method: 'push',
                    },
                }),
            );
        });
    });
});
