import React from 'react';

import HelpIcon from '@mui/icons-material/HelpOutline';
import { Stack, Tooltip, Typography } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { CommentField } from './fields/CommentField';
import { ProposedValueField } from './fields/ProposedValueField';

export function AnnotationCommentStep({ field, form, initialValue }) {
    const { translate } = useTranslate();
    const annotationInitialValue = useStore(form.store, (state) => {
        return state.values.initialValue?.replace(/<[^>]*>/g, '');
    });

    const kind = useStore(form.store, (state) => {
        return state.values.kind;
    });

    return (
        <>
            <Stack direction="row" gap={1} alignItems="center">
                <Tooltip title={annotationInitialValue}>
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {kind === 'removal' &&
                            (Array.isArray(initialValue)
                                ? translate('annotation_remove_value', {
                                      value: annotationInitialValue,
                                  })
                                : translate('annotation_remove_content', {
                                      value: annotationInitialValue,
                                  }))}
                        {kind === ANNOTATION_KIND_CORRECTION &&
                            translate('annotation_correct_value', {
                                value: annotationInitialValue,
                            })}
                        {kind === 'addition' &&
                            translate('annotation_add_value')}
                        {kind === 'comment' &&
                            translate('annotation_general_comment')}
                    </Typography>
                </Tooltip>
                <Tooltip title={translate('public_annotation')}>
                    <HelpIcon fontSize="1.125rem" />
                </Tooltip>
            </Stack>
            {[ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                kind,
            ) && <ProposedValueField form={form} field={field} />}
            <CommentField form={form} />
        </>
    );
}

AnnotationCommentStep.propTypes = {
    field: PropTypes.object.isRequired,
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
};
