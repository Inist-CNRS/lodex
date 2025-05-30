import AddIcon from '@mui/icons-material/Add';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import EditIcon from '@mui/icons-material/Edit';
import RemoveIcon from '@mui/icons-material/Remove';
import {
    ListItemIcon,
    MenuItem,
    MenuList,
    Stack,
    useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import CommentIcon from '@mui/icons-material/Comment';
import { useField } from '@tanstack/react-form';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '../../../../common/validator/annotation.validator';
import { useTranslate } from '../../i18n/I18NContext';
import { COMMENT_STEP, VALUE_STEP } from '../steps';

export function TargetField({ form, field, initialValue, goToStep }) {
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

    return (
        <form.Field name="target">
            {(formField) => {
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
                                formField.handleChange('title');
                                kindField.handleChange('comment');
                                initialValueField.handleChange(null);
                                goToStep(COMMENT_STEP);
                            }}
                        >
                            <Stack direction="row" spacing={1}>
                                <ListItemIcon>
                                    <CommentIcon
                                        color={theme.palette.primary.main}
                                        htmlColor={theme.palette.primary.main}
                                    />
                                </ListItemIcon>
                                {translate('annotation_annotate_field_choice')}
                            </Stack>
                            <ArrowForwardIosIcon
                                color={theme.palette.primary.main}
                                htmlColor={theme.palette.primary.main}
                            />
                        </MenuItem>
                        {field.enableAnnotationKindCorrection !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    kindField.handleChange(
                                        ANNOTATION_KIND_CORRECTION,
                                    );

                                    if (Array.isArray(initialValue)) {
                                        goToStep(VALUE_STEP);
                                        return;
                                    }
                                    initialValueField.handleChange(
                                        initialValue?.toString(),
                                    );
                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <ListItemIcon>
                                        <EditIcon
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate('annotation_correct_content')}
                                </Stack>
                                <ArrowForwardIosIcon
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}
                        {field.enableAnnotationKindAddition !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    initialValueField.handleChange(null);
                                    kindField.handleChange(
                                        ANNOTATION_KIND_ADDITION,
                                    );

                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <ListItemIcon>
                                        <AddIcon
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate('annotation_add_content')}
                                </Stack>
                                <ArrowForwardIosIcon
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}

                        {field.enableAnnotationKindRemoval !== false && (
                            <MenuItem
                                sx={{
                                    border: `1px solid ${theme.palette.primary.main}`,
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    fontWeight: 'bold',
                                }}
                                onClick={() => {
                                    formField.handleChange('value');
                                    kindField.handleChange(
                                        ANNOTATION_KIND_REMOVAL,
                                    );

                                    if (Array.isArray(initialValue)) {
                                        goToStep(VALUE_STEP);
                                        return;
                                    }
                                    initialValueField.handleChange(
                                        initialValue?.toString(),
                                    );
                                    goToStep(COMMENT_STEP);
                                }}
                            >
                                <Stack direction="row" spacing={1}>
                                    <ListItemIcon>
                                        <RemoveIcon
                                            color={theme.palette.primary.main}
                                            htmlColor={
                                                theme.palette.primary.main
                                            }
                                        />
                                    </ListItemIcon>
                                    {translate(
                                        'annotation_remove_content_choice',
                                    )}
                                </Stack>
                                <ArrowForwardIosIcon
                                    color={theme.palette.primary.main}
                                    htmlColor={theme.palette.primary.main}
                                />
                            </MenuItem>
                        )}
                    </MenuList>
                );
            }}
        </form.Field>
    );
}

TargetField.propTypes = {
    form: PropTypes.object.isRequired,
    field: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
    goToStep: PropTypes.func.isRequired,
};
