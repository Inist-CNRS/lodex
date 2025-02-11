import { MenuItem, MenuList, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';
import EditIcon from '@mui/icons-material/Edit';

import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';

export function KindField({ form, initialValue, goToStep }) {
    const theme = useTheme();
    const { translate } = useTranslate();

    return (
        <form.Field name="kind">
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
                                gap: 1,
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                field.handleChange('correct');

                                if (Array.isArray(initialValue)) {
                                    goToStep(VALUE_STEP);
                                    return;
                                }
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            <EditIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                            {translate('annotation_correct_content')}
                        </MenuItem>
                        <MenuItem
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                display: 'flex',
                                gap: 1,
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                field.handleChange('removal');

                                if (Array.isArray(initialValue)) {
                                    goToStep(VALUE_STEP);
                                    return;
                                }
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            <RemoveIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                            {translate('annotation_remove_content')}
                        </MenuItem>
                    </MenuList>
                );
            }}
        </form.Field>
    );
}

KindField.propTypes = {
    form: PropTypes.object.isRequired,
    goToStep: PropTypes.func.isRequired,
    initialValue: PropTypes.any,
};
