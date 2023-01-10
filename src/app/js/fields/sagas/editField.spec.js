import { put } from 'redux-saga/effects';

import { handleEditField } from './editField';

describe('fields saga', () => {
    describe('handleEditField', () => {
        it('should redirect to edited field if field and filter are defined', () => {
            const saga = handleEditField({
                payload: { field: 'foo', filter: 'bar' },
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

        it('should redirect to filter main page if field and subresourceId are not defined', () => {
            const saga = handleEditField({
                payload: { filter: 'bar' },
            });
            expect(saga.next().value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/bar'],
                        method: 'push',
                    },
                }),
            );
        });

        it('should redirect to filter subresource page if field is not defined, filter is document and subresourceId is defined', () => {
            const saga = handleEditField({
                payload: { filter: 'document', subresourceId: 'baz' },
            });
            expect(saga.next().value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/document/baz'],
                        method: 'push',
                    },
                }),
            );
        });
    });
});
