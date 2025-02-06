import { MenuItem, MenuList } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';
import { useField } from '@tanstack/react-form';

export function TargetField({ form, initialValue, goToStep }) {
    const { translate } = useTranslate();

    const initialValueField = useField({
        name: 'initialValue',
        form,
    });

    const isList = Array.isArray(initialValue);

    return (
        <form.Field name="target">
            {(field) => {
                return (
                    <MenuList>
                        <MenuItem
                            onClick={() => {
                                field.handleChange('title');
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_title')}
                        </MenuItem>
                        <MenuItem
                            onClick={() => {
                                field.handleChange('value');
                                if (isList) {
                                    goToStep(VALUE_STEP);
                                    return;
                                }
                                initialValueField.handleChange(initialValue);
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_value')}
                        </MenuItem>
                    </MenuList>
                );
            }}
        </form.Field>
    );
}

TargetField.propTypes = {
    form: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
    goToStep: PropTypes.func.isRequired,
};
