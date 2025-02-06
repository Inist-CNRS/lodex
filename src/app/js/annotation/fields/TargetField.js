import { Button, FormControl } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP } from '../steps';

export function TargetField({ form, goToStep }) {
    const { translate } = useTranslate();
    return (
        <form.Field name="target">
            {(field) => {
                return (
                    <FormControl fullWidth>
                        <Button
                            onClick={() => {
                                field.handleChange('title');
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_title')}
                        </Button>
                        <Button
                            onClick={() => {
                                field.handleChange('value');
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_value')}
                        </Button>
                    </FormControl>
                );
            }}
        </form.Field>
    );
}

TargetField.propTypes = {
    form: PropTypes.object.isRequired,
    goToStep: PropTypes.func.isRequired,
};
