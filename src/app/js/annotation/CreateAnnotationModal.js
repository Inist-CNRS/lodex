import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    CircularProgress,
    FormControl,
    FormHelperText,
    Popover,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React from 'react';

import { annotationSchema } from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';

export function CreateAnnotationModal({
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
    anchorEl,
}) {
    const { translate } = useTranslate();
    const form = useForm({
        defaultValues: {
            comment: '',
        },
        onSubmit: async ({ value }) => {
            await onSubmit(value);
            resetForm();
        },
        validators: {
            onChange: annotationSchema,
        },
    });

    const resetForm = () => {
        form.reset();
        form.setErrorMap({});
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    return (
        <Popover
            open={isOpen}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    form.handleSubmit();
                },
                sx: {
                    maxWidth: 'sm',
                    width: '100%',
                    padding: 2,
                },
            }}
            role="dialog"
        >
            <Stack gap={2}>
                <Typography variant="h6" color="text.gray">
                    {translate('annotation_add_comment')}
                </Typography>

                <form.Field name="comment">
                    {(field) => {
                        const hasErrors = !!(
                            field.state.meta.isTouched &&
                            field.state.meta.errors?.length
                        );

                        return (
                            <FormControl fullWidth>
                                <TextField
                                    label={translate('annotation_comment')}
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    minRows={5}
                                    maxRows={10}
                                    multiline
                                    sx={{ marginTop: 1 }}
                                    error={hasErrors}
                                    required
                                />
                                {hasErrors && (
                                    <FormHelperText error role="alert">
                                        {translate(field.state.meta.errors[0])}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        );
                    }}
                </form.Field>

                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={'space-between'}
                >
                    <Button onClick={onClose} disabled={isSubmitting}>
                        {translate('cancel')}
                    </Button>
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        disabled={isSubmitting}
                        startIcon={
                            isSubmitting ? (
                                <CircularProgress color="primary" size="1em" />
                            ) : (
                                <SaveIcon />
                            )
                        }
                    >
                        {translate('validate')}
                    </Button>
                </Stack>
            </Stack>
        </Popover>
    );
}

CreateAnnotationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    anchorEl: PropTypes.object.isRequired,
};
