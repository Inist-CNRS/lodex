import React from 'react';

import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import { CommentField } from './fields/CommentField';
import { Tooltip, Typography } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
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
                        {kind === 'comment' &&
                            translate('annotation_correct_value', {
                                value: annotationInitialValue,
                            })}
                    </Typography>
                </Tooltip>
            )}
            {kind === 'correct' && <ProposedValueField form={form} />}
            <CommentField form={form} />
        </>
    );
}

AnnotationCommentStep.propTypes = {
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.string,
    goToStep: PropTypes.func.isRequired,
};
