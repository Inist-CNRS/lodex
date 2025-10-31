import get from 'lodash/get';
import set from 'lodash/set';
import { call, put, select, takeLatest } from 'redux-saga/effects';

import {
    loadField,
    SAVE_FIELD,
    SAVE_FIELD_FROM_DATA,
    saveFieldError,
    saveFieldSuccess,
} from '../reducer.ts';

import { fromFields, fromUser } from '../../sharedSelectors';

import { push } from 'redux-first-history';
import { SCOPE_DOCUMENT } from '@lodex/common';
import fetchSaga from '@lodex/frontend-common/fetch/fetchSaga';
import {
    FIELD_ANNOTATION_FORMAT_LIST,
    FIELD_ANNOTATION_FORMAT_TEXT,
} from '../FieldAnnotationFormat.tsx';
import { splitAnnotationFormatListOptions } from '../annotations.ts';
import { FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE } from '../FieldAnnotationFormatListKind.tsx';

export const prepareFieldFormData = (values: any) => {
    try {
        const { annotationFormat, annotable, annotationFormatListOptions } =
            values;
        const annotationFormatListKind =
            values.annotationFormatListKind ??
            FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE;
        const annotationFormatListSupportsNewValues =
            values.annotationFormatListSupportsNewValues ?? true;
        const isListFormat = annotationFormat === FIELD_ANNOTATION_FORMAT_LIST;

        return {
            ...values,
            annotationFormat: annotable
                ? annotationFormat
                : FIELD_ANNOTATION_FORMAT_TEXT,
            annotationFormatListOptions:
                annotable && isListFormat
                    ? splitAnnotationFormatListOptions(
                          annotationFormatListOptions,
                      )
                    : [],
            annotationFormatListKind:
                annotable && isListFormat
                    ? annotationFormatListKind
                    : FIELD_ANNOTATION_FORMAT_LIST_KIND_SINGLE,
            annotationFormatListSupportsNewValues:
                annotable && isListFormat
                    ? annotationFormatListSupportsNewValues
                    : false,
        };
    } catch (error) {
        return undefined;
    }
};

// @ts-expect-error TS7006
export const sanitizeField = (fieldData) => {
    const valueOperation = get(fieldData, 'transformers[0].operation');
    if (valueOperation === 'CONCAT') {
        const values = get(fieldData, 'transformers[0].args');

        return set({ ...fieldData }, 'transformers[0].args', [
            ...values.slice(0, 2),
            // @ts-expect-error TS7031
            ...values.slice(2).filter(({ value }) => !!value),
        ]);
    }

    return fieldData;
};

// @ts-expect-error TS7031
export function* handleSaveField({ payload }) {
    const {
        field: { subresourceId },
        filter,
        values,
    } = payload;

    const redirectingPath = `/display/${filter}${
        filter === SCOPE_DOCUMENT && subresourceId
            ? `/subresource/${subresourceId}`
            : ''
    }`;

    // @ts-expect-error TS7057
    const fieldData = yield call(prepareFieldFormData, values);
    // @ts-expect-error TS7057
    const sanitizedFieldData = yield call(sanitizeField, fieldData);
    // @ts-expect-error TS7057
    const request = yield select(
        fromUser.getSaveFieldRequest,
        sanitizedFieldData,
    );
    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }
    yield put(saveFieldSuccess());
    yield put(push(redirectingPath));

    yield put(loadField());
}

// @ts-expect-error TS7031
export function* handleSaveFieldData({ payload }) {
    // @ts-expect-error TS7057
    const field = yield select(fromFields.getFromName, payload.name);
    if (!field) {
        return;
    }

    // @ts-expect-error TS7057
    const sanitizedFieldData = yield call(sanitizeField, {
        ...field,
        ...payload.data,
    });

    // @ts-expect-error TS7057
    const request = yield select(
        fromUser.getSaveFieldRequest,
        sanitizedFieldData,
    );

    const { error } = yield call(fetchSaga, request);

    if (error) {
        yield put(saveFieldError(error));
        return;
    }

    if (!payload.silent) {
        yield put(saveFieldSuccess());
    }

    yield put(loadField());
}

export default function* watchSaveField() {
    // @ts-expect-error TS2769
    yield takeLatest([SAVE_FIELD], handleSaveField);
    // @ts-expect-error TS2769
    yield takeLatest([SAVE_FIELD_FROM_DATA], handleSaveFieldData);
}
