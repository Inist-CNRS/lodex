import { MenuItem, MenuList, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import RemoveIcon from '@mui/icons-material/Remove';

import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP } from '../steps';

export function KindField({ form, goToStep }) {
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
                                field.handleChange('removal');
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
};
