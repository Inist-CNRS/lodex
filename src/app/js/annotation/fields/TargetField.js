import { MenuItem, MenuList } from '@mui/material';
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
    goToStep: PropTypes.func.isRequired,
};
