import React from 'react';
import { Typography } from '@mui/material';
import { useTranslate } from '../i18n/I18NContext';
import PropTypes from 'prop-types';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';
import { useStore } from '@tanstack/react-form';

export const CreateAnnotationTitle = ({ fieldLabel, step, form }) => {
    const { translate } = useTranslate();

    const target = useStore(form.store, (state) => {
        return state.values.target;
    });

    if (step === TARGET_STEP || target === 'title') {
        return (
            <Typography variant="h6" color="text.gray">
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
        <Typography variant="h6" color="text.gray">
            {fieldLabel
                ? translate('annotation_title_annotate_content', {
                      field: fieldLabel,
                  })
                : translate('annotation_title_annotate_content_no_field_label')}
        </Typography>
    );
};

CreateAnnotationTitle.propTypes = {
    fieldLabel: PropTypes.string,
    step: PropTypes.oneOf([TARGET_STEP, VALUE_STEP, COMMENT_STEP, AUTHOR_STEP]),
    form: PropTypes.object.isRequired,
};
