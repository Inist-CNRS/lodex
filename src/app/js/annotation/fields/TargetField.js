import { MenuItem, MenuList, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP, KIND_STEP } from '../steps';
import { useField } from '@tanstack/react-form';

export function TargetField({ form, initialValue, goToStep }) {
    const theme = useTheme();
    const { translate } = useTranslate();

    const initialValueField = useField({
        name: 'initialValue',
        form,
    });
    const kindField = useField({
        name: 'kind',
        form,
    });

    const isList = Array.isArray(initialValue);

    return (
        <form.Field name="target">
            {(field) => {
                return (
                    <MenuList
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 2,
                        }}
                    >
                        <MenuItem
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                field.handleChange('title');
                                kindField.handleChange(null);
                                initialValueField.handleChange(null);
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_title')}
                            <ArrowForwardIosIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                        </MenuItem>
                        <MenuItem
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                display: 'flex',
                                justifyContent: 'space-between',
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                field.handleChange('value');
                                if (isList) {
                                    initialValueField.handleChange(null);
                                    goToStep(KIND_STEP);
                                    return;
                                }
                                initialValueField.handleChange(initialValue);
                                goToStep(KIND_STEP);
                            }}
                        >
                            {translate('annotation_comment_target_value')}
                            <ArrowForwardIosIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
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
