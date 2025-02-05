import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    CircularProgress,
    Popover,
    Stack,
    Typography,
} from '@mui/material';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { annotationCreationSchema } from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { AuthorEmailField } from './fields/AuthorEmailField';
import { AuthorNameField } from './fields/AuthorNameField';
import { CommentField } from './fields/CommentField';

const LAST_STEP_INDEX = 1;

const COMMENT_STEP = 0;
const AUTHOR_STEP = 1;

export function CreateAnnotationModal({
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
            onChange: annotationCreationSchema,
        },
    });

    const [currentStep, setCurrentStep] = useState(0);
    // This is used to avoid submitting the form when the user clicks on the next button if the form is valid
    const [disableSubmit, setDisableSubmit] = useState(false);

    const resetForm = () => {
        form.reset();
        form.setErrorMap({});
        setCurrentStep(0);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleBack = (e) => {
        e.preventDefault();
        e.stopPropagation();

        setCurrentStep((currentStep) => Math.max(0, currentStep - 1));
    };

    const handleNext = () => {
        setCurrentStep((currentStep) =>
            Math.min(LAST_STEP_INDEX, currentStep + 1),
        );
    };

    const isRequiredFieldValid = useCallback((formState, fieldName) => {
        const fieldState = formState.fieldMeta[fieldName];
        if (!fieldState) {
            return false;
        }

        return fieldState.isTouched && fieldState.errors.length === 0;
    }, []);

    const isOptionalFieldValid = useCallback((formState, fieldName) => {
        const fieldState = formState.fieldMeta[fieldName];
        if (!fieldState) {
            return false;
        }

        return !fieldState.isTouched || fieldState.errors.length === 0;
    }, []);

    const isCommentStepValid = useStore(form.store, (state) => {
        if (currentStep !== COMMENT_STEP) {
            return true;
        }

        return isRequiredFieldValid(state, 'comment');
    });

    const isAuthorStepValid = useStore(form.store, (state) => {
        if (currentStep !== AUTHOR_STEP) {
            return true;
        }

        return (
            isRequiredFieldValid(state, 'authorName') &&
            isOptionalFieldValid(state, 'authorEmail')
        );
    });

    const enableNextButton = useMemo(() => {
        if (currentStep === COMMENT_STEP) {
            return isCommentStepValid;
        }

        return false;
    }, [currentStep, isCommentStepValid]);

    useEffect(() => {
        if (currentStep !== LAST_STEP_INDEX) {
            return;
        }
        setDisableSubmit(true);
        const timer = setTimeout(() => {
            setDisableSubmit(false);
        }, 300);
        return () => {
            setDisableSubmit(false);
            timer && clearTimeout(timer);
        };
    }, [currentStep]);

    const isCurrentStepCommentStep = currentStep === COMMENT_STEP;
    const isCurrentStepAuthorStep = currentStep === AUTHOR_STEP;

    return (
        <Popover
            open={true}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
            }}
            transformOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            PaperProps={{
                component: 'form',
                onSubmit: (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (disableSubmit) {
                        return;
                    }

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

                <Box fullWidth role="tabpanel">
                    {currentStep === 0 && (
                        <Stack
                            spacing={2}
                            aria-hidden={!isCurrentStepCommentStep}
                            aria-label={translate('annotation_step_comment')}
                            role="tab"
                        >
                            <CommentField
                                form={form}
                                active={isCurrentStepCommentStep}
                            />
                        </Stack>
                    )}

                    {currentStep === 1 && (
                        <Stack
                            spacing={2}
                            aria-hidden={!isCurrentStepAuthorStep}
                            aria-label={translate('annotation_step_author')}
                            role="tab"
                        >
                            <AuthorNameField
                                form={form}
                                active={isCurrentStepAuthorStep}
                            />
                            <AuthorEmailField
                                form={form}
                                active={isCurrentStepAuthorStep}
                            />
                        </Stack>
                    )}
                </Box>

                <Stack
                    direction="row"
                    spacing={2}
                    justifyContent={'space-between'}
                >
                    {currentStep === 0 ? (
                        <Button
                            type="button"
                            onClick={handleClose}
                            disabled={isSubmitting}
                        >
                            {translate('cancel')}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleBack}
                            disabled={isSubmitting}
                            startIcon={<ChevronLeftIcon />}
                        >
                            {translate('back')}
                        </Button>
                    )}

                    {currentStep === LAST_STEP_INDEX ? (
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            disabled={
                                disableSubmit ||
                                isSubmitting ||
                                !isAuthorStepValid
                            }
                            startIcon={
                                isSubmitting ? (
                                    <CircularProgress
                                        color="primary"
                                        size="1em"
                                    />
                                ) : (
                                    <SaveIcon />
                                )
                            }
                        >
                            {translate('validate')}
                        </Button>
                    ) : (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!enableNextButton}
                            endIcon={<ChevronRightIcon />}
                        >
                            {translate('next')}
                        </Button>
                    )}
                </Stack>
            </Stack>
        </Popover>
    );
}

CreateAnnotationModal.propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    anchorEl: PropTypes.object.isRequired,
};
