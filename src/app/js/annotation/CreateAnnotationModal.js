import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormHelperText,
    TextField,
} from '@mui/material';
import { useForm } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React from 'react';

import '@testing-library/jest-dom';
import { annotationSchema } from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';

export function CreateAnnotationModal({
    isOpen,
    isSubmitting,
    onClose,
    onSubmit,
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
        <Dialog
            open={isOpen}
            onClose={handleClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    form.handleSubmit();
                },
            }}
        >
            <DialogTitle>{translate('annotation_add_comment')}</DialogTitle>
            <DialogContent>
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
                                    rows={5}
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
            </DialogContent>
            <DialogActions>
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
            </DialogActions>
        </Dialog>
    );
}

CreateAnnotationModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
};
