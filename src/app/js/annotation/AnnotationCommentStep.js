import React from 'react';

import { Tooltip, Typography } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { CommentField } from './fields/CommentField';
import { ProposedValueField } from './fields/ProposedValueField';

export function AnnotationCommentStep({ form }) {
    const { translate } = useTranslate();
    const annotationInitialValue = useStore(form.store, (state) => {
        return state.values.initialValue?.replace(/<[^>]*>/g, '');
    });

    const kind = useStore(form.store, (state) => {
        return state.values.kind;
    });

    return (
        <>
            {annotationInitialValue && (
                <Tooltip title={annotationInitialValue}>
                    <Typography
                        sx={{
                            whiteSpace: 'nowrap',
                            textOverflow: 'ellipsis',
                            overflow: 'hidden',
                        }}
                    >
                        {kind === 'removal' &&
                            translate('annotation_remove_value', {
                                value: annotationInitialValue,
                            })}
                        {kind === ANNOTATION_KIND_CORRECTION &&
                            translate('annotation_correct_value', {
                                value: annotationInitialValue,
                            })}
                        {kind === 'addition' &&
                            translate('annotation_add_value')}
                    </Typography>
                </Tooltip>
            )}
            {[ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                kind,
            ) && <ProposedValueField form={form} />}
            <CommentField form={form} />
        </>
    );
}

AnnotationCommentStep.propTypes = {
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
    goToStep: PropTypes.func.isRequired,
};
