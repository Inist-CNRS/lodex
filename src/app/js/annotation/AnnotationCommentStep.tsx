// @ts-expect-error TS6133
import React from 'react';

import { Tooltip, Typography } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { CommentField } from './fields/CommentField';
import { ProposedValueField } from './fields/ProposedValueField';
import { getIsFieldValueAnUrl } from '../formats';

export const CommentDescription = ({
    // @ts-expect-error TS7031
    kind,
    // @ts-expect-error TS7031
    isFieldAnUrl,
    // @ts-expect-error TS7031
    annotationInitialValue,
    // @ts-expect-error TS7031
    fieldInitialValue,
}) => {
    const { translate } = useTranslate();
    switch (kind) {
        case ANNOTATION_KIND_CORRECTION: {
            return isFieldAnUrl ? (
                <Typography
                    sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {translate('annotation_correct_content')}
                </Typography>
            ) : (
                <Tooltip title={annotationInitialValue}>
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {/*
                         // @ts-expect-error TS2554 */}
                        {translate('annotation_correct_value', {
                            value: annotationInitialValue,
                        })}
                    </Typography>
                </Tooltip>
            );
        }
        case ANNOTATION_KIND_ADDITION: {
            return (
                <Typography
                    sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {translate('annotation_add_value')}
                </Typography>
            );
        }
        case ANNOTATION_KIND_COMMENT: {
            return (
                <Typography
                    sx={{
                        whiteSpace: 'nowrap',
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {translate('annotation_general_comment')}
                </Typography>
            );
        }
        case ANNOTATION_KIND_REMOVAL: {
            if (isFieldAnUrl) {
                return (
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {translate('annotation_remove_content')}
                    </Typography>
                );
            }

            if (Array.isArray(fieldInitialValue)) {
                return (
                    <Tooltip title={annotationInitialValue}>
                        <Typography
                            sx={{
                                whiteSpace: 'nowrap',
                                textOverflow: 'ellipsis',
                                overflow: 'hidden',
                            }}
                        >
                            {/*
                             // @ts-expect-error TS2554 */}
                            {translate('annotation_remove_value', {
                                value: annotationInitialValue,
                            })}
                        </Typography>
                    </Tooltip>
                );
            }

            return (
                <Tooltip title={annotationInitialValue}>
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {/*
                         // @ts-expect-error TS2554 */}
                        {translate('annotation_remove_content_from', {
                            value: annotationInitialValue,
                        })}
                    </Typography>
                </Tooltip>
            );
        }
    }
};

CommentDescription.propTypes = {
    isFieldAnUrl: PropTypes.bool.isRequired,
    kind: PropTypes.string.isRequired,
    annotationInitialValue: PropTypes.string,
    fieldInitialValue: PropTypes.any,
};

// @ts-expect-error TS7031
export function AnnotationCommentStep({ field, form, initialValue }) {
    const isFieldAnUrl = getIsFieldValueAnUrl(field.format?.name);

    const annotationInitialValue = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.initialValue?.replace(/<[^>]*>/g, '');
    });

    const kind = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.kind;
    });

    return (
        <>
            {/*
             // @ts-expect-error TS2786 */}
            <CommentDescription
                annotationInitialValue={annotationInitialValue}
                fieldInitialValue={initialValue}
                isFieldAnUrl={isFieldAnUrl}
                kind={kind}
            />
            {[ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                kind,
            ) && (
                <ProposedValueField
                    form={form}
                    field={field}
                    initialValue={annotationInitialValue}
                />
            )}
            <CommentField form={form} />
        </>
    );
}

AnnotationCommentStep.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
};
