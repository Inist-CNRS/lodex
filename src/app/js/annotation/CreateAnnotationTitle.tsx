// @ts-expect-error TS6133
import React from 'react';
import { Typography } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';
import { useStore } from '@tanstack/react-form';

interface CreateAnnotationTitleProps {
    fieldLabel?: string;
    step?: unknown | unknown | unknown | unknown;
    form: object;
}

export const CreateAnnotationTitle = ({
    fieldLabel,
    step,
    form
}: CreateAnnotationTitleProps) => {
    const { translate } = useTranslate();

    const target = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.target;
    });

    if (step === TARGET_STEP || target === 'title') {
        return (
            <Typography role="heading" variant="h6" color="text.gray">
                {fieldLabel
                    ? translate('annotation_title_annotate_field', {
                          field: fieldLabel,
                      })
                    : translate(
                          'annotation_title_annotate_field_no_field_label',
                      )}
            </Typography>
        );
    }

    return (
        <Typography role="heading" variant="h6" color="text.gray">
            {fieldLabel
                ? translate('annotation_title_annotate_content', {
                      field: fieldLabel,
                  })
                : translate('annotation_title_annotate_content_no_field_label')}
        </Typography>
    );
};
