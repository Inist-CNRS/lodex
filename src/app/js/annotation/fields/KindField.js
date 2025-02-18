import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import { MenuItem, MenuList, useTheme } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { useField } from '@tanstack/react-form';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '../../../../common/validator/annotation.validator';
import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';

export function KindField({ form, initialValue, goToStep }) {
    const theme = useTheme();
    const { translate } = useTranslate();

    const initialValueField = useField({
        name: 'initialValue',
        form,
    });

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
                                field.handleChange(ANNOTATION_KIND_CORRECTION);

                                if (Array.isArray(initialValue)) {
                                    goToStep(VALUE_STEP);
                                    return;
                                }
                                initialValueField.handleChange(initialValue);
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
                                initialValueField.handleChange(null);
                                field.handleChange(ANNOTATION_KIND_ADDITION);

                                goToStep(COMMENT_STEP);
                            }}
                        >
                            <AddIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                            {translate('annotation_add_content')}
                        </MenuItem>
                        <MenuItem
                            sx={{
                                border: `1px solid ${theme.palette.primary.main}`,
                                display: 'flex',
                                gap: 1,
                                fontWeight: 'bold',
                            }}
                            onClick={() => {
                                field.handleChange(ANNOTATION_KIND_REMOVAL);

                                if (Array.isArray(initialValue)) {
                                    goToStep(VALUE_STEP);
                                    return;
                                }
                                initialValueField.handleChange(initialValue);
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
