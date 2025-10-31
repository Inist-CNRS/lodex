import { call, put, select } from 'redux-saga/effects';

import fetchSaga from '../../fetch/fetchSaga';

import { saveFieldError, loadField, saveFieldSuccess } from '../reducer';

import { fromUser } from '../../sharedSelectors';

import {
    handleSaveField,
    prepareFieldFormData,
    sanitizeField,
} from './saveField';

describe('fields saga', () => {
    describe('prepareFieldFormData', () => {
        it('should split annotationFormatListOptions', () => {
            expect(
                prepareFieldFormData({
                    annotable: true,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'multiple',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: false,
                }),
            ).toStrictEqual({
                annotable: true,
                annotationFormat: 'list',
                annotationFormatListKind: 'multiple',
                annotationFormatListOptions: ['a', 'b', 'c'],
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should support field without annotationFormatListKind', () => {
            expect(
                prepareFieldFormData({
                    annotable: true,
                    annotationFormat: 'list',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: false,
                }),
            ).toStrictEqual({
                annotable: true,
                annotationFormat: 'list',
                annotationFormatListKind: 'single',
                annotationFormatListOptions: ['a', 'b', 'c'],
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should set annotationFormatListOptions to an empty array if field is not annotable', () => {
            expect(
                prepareFieldFormData({
                    annotable: false,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: false,
                }),
            ).toStrictEqual({
                annotable: false,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should set annotationFormatListOptions to an empty array if annotationFormat is text', () => {
            expect(
                prepareFieldFormData({
                    annotable: true,
                    annotationFormat: 'text',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: false,
                }),
            ).toStrictEqual({
                annotable: true,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should set annotationFormatListKind to single if field is not annotable', () => {
            expect(
                prepareFieldFormData({
                    annotable: false,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'multiple',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: true,
                }),
            ).toStrictEqual({
                annotable: false,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should support annotationFormatListSupportsNewValues', () => {
            expect(
                prepareFieldFormData({
                    annotable: true,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: true,
                }),
            ).toStrictEqual({
                annotable: true,
                annotationFormat: 'list',
                annotationFormatListOptions: ['a', 'b', 'c'],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: true,
            });
        });

        it('should set annotationFormatListSupportsNewValues to false if absent', () => {
            expect(
                prepareFieldFormData({
                    annotable: false,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                    annotationFormatListOptions: 'a\nb\nc',
                }),
            ).toStrictEqual({
                annotable: false,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should set annotationFormatListSupportsNewValues to false if annotationFormat is text', () => {
            expect(
                prepareFieldFormData({
                    annotable: true,
                    annotationFormat: 'text',
                    annotationFormatListKind: 'single',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: true,
                }),
            ).toStrictEqual({
                annotable: true,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });

        it('should set annotationFormatListSupportsNewValues to false if field is not annotable', () => {
            expect(
                prepareFieldFormData({
                    annotable: false,
                    annotationFormat: 'list',
                    annotationFormatListKind: 'single',
                    annotationFormatListOptions: 'a\nb\nc',
                    annotationFormatListSupportsNewValues: true,
                }),
            ).toStrictEqual({
                annotable: false,
                annotationFormat: 'text',
                annotationFormatListOptions: [],
                annotationFormatListKind: 'single',
                annotationFormatListSupportsNewValues: false,
            });
        });
    });

    describe('handleSaveField', () => {
        const formValues = {
            label: 'field label',
        };
        const saga = handleSaveField({
            payload: {
                field: { subresourceId: 'id' },
                filter: 'foo',
                values: formValues,
            },
        });

        it('should select getFieldFormData', () => {
            expect(saga.next().value).toEqual(
                call(prepareFieldFormData, formValues),
            );
        });

        it('should call sanitizeField with field form data', () => {
            // @ts-expect-error TS2345
            expect(saga.next('field form data').value).toEqual(
                call(sanitizeField, 'field form data'),
            );
        });

        it('should select getSaveFieldRequest', () => {
            // @ts-expect-error TS2345
            expect(saga.next('sanitized field form data').value).toEqual(
                select(
                    fromUser.getSaveFieldRequest,
                    'sanitized field form data',
                ),
            );
        });

        it('should call fetchSaga with the request', () => {
            // @ts-expect-error TS2345
            expect(saga.next('request').value).toEqual(
                call(fetchSaga, 'request'),
            );
        });

        it('should put saveFieldSuccess action', () => {
            // @ts-expect-error TS2345
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(saveFieldSuccess()),
            );
        });

        it('should put push action', () => {
            expect(saga.next().value).toEqual(
                put({
                    type: '@@router/CALL_HISTORY_METHOD',
                    payload: {
                        args: ['/display/foo'],
                        method: 'push',
                    },
                }),
            );
        });

        it('should put loadField action', () => {
            // @ts-expect-error TS2345
            expect(saga.next({ response: 'foo' }).value).toEqual(
                put(loadField()),
            );
        });

        it('should put saveFieldError action with error if any', () => {
            const failedSaga = handleSaveField({
                payload: { field: { subresourceId: 'id' }, filter: 'foo' },
            });
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            failedSaga.next();
            expect(failedSaga.next({ error: 'foo' }).value).toEqual(
                put(saveFieldError('foo')),
            );
        });
    });
});
