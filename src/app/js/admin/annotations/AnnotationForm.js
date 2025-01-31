import React from 'react';
import { useRouteMatch } from 'react-router-dom';
import { useUpdateAnnotation } from './useUpdateAnnotation';
import { useForm, useStore } from '@tanstack/react-form';
import { annotationUpdateSchema } from '../../../../common/validator/annotation.validator';
import SaveIcon from '@mui/icons-material/Save';
import {
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from '@mui/material';
import { useTranslate } from '../../i18n/I18NContext';
import PropTypes from 'prop-types';

const statuses = ['to_review', 'ongoing', 'validated', 'rejected'];

export const AnnotationForm = ({ annotation }) => {
    const { translate } = useTranslate();
    const match = useRouteMatch();
    const id = match.params.annotationId;

    const { handleUpdateAnnotation, isSubmitting } = useUpdateAnnotation();

    const form = useForm({
        defaultValues: {
            status: annotation.status,
            internalComment: annotation.internalComment,
            administrator: annotation.administrator,
        },
        onSubmit: async ({ value }) => {
            await handleUpdateAnnotation(id, value);
        },
        validators: {
            onChange: annotationUpdateSchema,
        },
    });

    const isValid = useStore(form.store, (state) => {
        return state.isValid;
    });

    return (
        <form
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                form.handleSubmit();
            }}
        >
            <Stack gap={2}>
                <form.Field name="status">
                    {(field) => {
                        return (
                            <FormControl fullWidth>
                                <Typography id="annotation_status" variant="h6">
                                    {translate('annotation_status')}
                                </Typography>
                                <Select
                                    aria-labelledby="annotation_status"
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    value={field.state.value}
                                >
                                    {statuses.map((status) => (
                                        <MenuItem key={status} value={status}>
                                            {translate(
                                                `annotation_status_${status}`,
                                            )}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        );
                    }}
                </form.Field>
                <form.Field name="internalComment">
                    {(field) => {
                        const hasErrors = !!(
                            field.state.meta.isTouched &&
                            field.state.meta.errors?.length
                        );
                        return (
                            <FormControl fullWidth>
                                <Typography
                                    id="annotation_internal_comment"
                                    variant="h6"
                                >
                                    {translate('annotation_internal_comment')} *
                                </Typography>
                                <TextField
                                    // label={`${translate('annotation_internal_comment')} *`}
                                    aria-labelledby="annotation_internal_comment"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    minRows={5}
                                    maxRows={10}
                                    multiline
                                    error={hasErrors}
                                />
                            </FormControl>
                        );
                    }}
                </form.Field>
                <form.Field name="administrator">
                    {(field) => {
                        const hasErrors = !!(
                            field.state.meta.isTouched &&
                            field.state.meta.errors?.length
                        );
                        return (
                            <FormControl fullWidth>
                                <Typography
                                    id="annotation_administrator"
                                    variant="h6"
                                >
                                    {translate('annotation_administrator')} *
                                </Typography>
                                <TextField
                                    aria-labelledby="annotation_administrator"
                                    name={field.name}
                                    value={field.state.value}
                                    onBlur={field.handleBlur}
                                    onChange={(e) =>
                                        field.handleChange(e.target.value)
                                    }
                                    error={hasErrors}
                                />
                            </FormControl>
                        );
                    }}
                </form.Field>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting || !isValid}
                    startIcon={
                        isSubmitting ? (
                            <CircularProgress color="primary" size="1em" />
                        ) : (
                            <SaveIcon />
                        )
                    }
                >
                    {translate('save')}
                </Button>
            </Stack>
        </form>
    );
};

AnnotationForm.propTypes = {
    annotation: PropTypes.shape({
        status: PropTypes.oneOf(status).isRequired,
        internalComment: PropTypes.string,
        administrator: PropTypes.string,
    }),
};
