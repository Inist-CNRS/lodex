import { Tooltip, Typography } from '@mui/material';
import { FormApi, useStore } from '@tanstack/react-form';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '@lodex/common';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { CommentField } from './fields/CommentField';
import { ProposedValueField } from './fields/ProposedValueField';
import { sanitize } from '@lodex/frontend-common/utils/sanitize';
import { getIsFieldValueAnUrl } from '@lodex/frontend-common/formats/getFormat';

interface CommentDescriptionProps {
    isFieldAnUrl: boolean;
    kind: string;
    annotationInitialValue: string;
    fieldInitialValue?: unknown;
}

export const CommentDescription = ({
    kind,

    isFieldAnUrl,

    annotationInitialValue,

    fieldInitialValue,
}: CommentDescriptionProps) => {
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
                        {translate('annotation_remove_content_from', {
                            value: annotationInitialValue,
                        })}
                    </Typography>
                </Tooltip>
            );
        }
    }
};

interface AnnotationCommentStepProps {
    field: {
        format?: {
            name: string;
        };
    };
    form: FormApi<any>;
    initialValue?: any;
}

export function AnnotationCommentStep({
    field,
    form,
    initialValue,
}: AnnotationCommentStepProps) {
    const isFieldAnUrl = getIsFieldValueAnUrl(field.format?.name);

    const annotationInitialValue = useStore(form.store, (state) => {
        return state.values.initialValue
            ? sanitize(state.values.initialValue)
            : '';
    });

    const kind = useStore(form.store, (state) => {
        return state.values.kind;
    });

    return (
        <>
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
