import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import SaveIcon from '@mui/icons-material/Save';
import {
    Box,
    Button,
    CircularProgress,
    Popover,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useState } from 'react';

import { annotationCreationSchema } from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { AuthorEmailField } from './fields/AuthorEmailField';
import { AuthorNameField } from './fields/AuthorNameField';
import { CommentField } from './fields/CommentField';
import { TargetField } from './fields/TargetField';
import {
    KIND_STEP,
    AUTHOR_STEP,
    COMMENT_STEP,
    nextStepByStep,
    previousStepByStep,
    TARGET_STEP,
    VALUE_STEP,
} from './steps';
import { ValueField } from './fields/ValueField';
import { KindField } from './fields/KindField';

const isRequiredFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return fieldState.isTouched && fieldState.errors.length === 0;
};

const isOptionalFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return !fieldState.isTouched || fieldState.errors.length === 0;
};

export function CreateAnnotationModal({
    isSubmitting,
    onClose,
    onSubmit,
    anchorEl,
    initialValue,
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

    const [currentStep, setCurrentStep] = useState(
        initialValue === null ? COMMENT_STEP : TARGET_STEP,
    );
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

        setCurrentStep((currentStep) => previousStepByStep[currentStep]);
    };

    const handleNext = () => {
        setCurrentStep((currentStep) => nextStepByStep[currentStep]);
    };

    const isValueStepValid = useStore(form.store, (state) => {
        if (currentStep !== VALUE_STEP) {
            return true;
        }

        // tanstack form does not support conditional validation (e.g. validation using superRefine to depend on another field value)
        return !!state.values.initialValue;
    });

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
    const annotationInitialValue = useStore(form.store, (state) => {
        return state.values.initialValue;
    });

    const enableNextButton = useMemo(() => {
        if (currentStep === COMMENT_STEP) {
            return isCommentStepValid;
        }
        if (currentStep === VALUE_STEP) {
            return isValueStepValid;
        }

        return false;
    }, [currentStep, isCommentStepValid, isValueStepValid]);

    useEffect(() => {
        if (currentStep !== AUTHOR_STEP) {
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
                    {currentStep === TARGET_STEP && (
                        <Stack
                            spacing={2}
                            aria-label={translate('annotation_step_target')}
                            role="tab"
                        >
                            <TargetField
                                form={form}
                                goToStep={setCurrentStep}
                                initialValue={initialValue}
                            />
                        </Stack>
                    )}
                    {currentStep === KIND_STEP && (
                        <Stack
                            spacing={2}
                            aria-label={translate('annotation_step_target')}
                            role="tab"
                        >
                            <KindField form={form} goToStep={setCurrentStep} />
                        </Stack>
                    )}
                    {currentStep === VALUE_STEP && (
                        <Stack
                            spacing={2}
                            aria-label={translate('annotation_step_value')}
                            role="tab"
                        >
                            <ValueField choices={initialValue} form={form} />
                        </Stack>
                    )}
                    {currentStep === COMMENT_STEP && (
                        <Stack
                            spacing={2}
                            aria-label={translate('annotation_step_comment')}
                            role="tab"
                        >
                            {annotationInitialValue && (
                                <Tooltip
                                    title={annotationInitialValue.replace(
                                        /<[^>]*>/g,
                                        '',
                                    )}
                                >
                                    <Typography
                                        sx={{
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        {translate('annotation_correct_value', {
                                            value: annotationInitialValue.replace(
                                                /<[^>]*>/g,
                                                '',
                                            ),
                                        })}
                                    </Typography>
                                </Tooltip>
                            )}
                            <CommentField
                                form={form}
                                active={isCurrentStepCommentStep}
                            />
                        </Stack>
                    )}

                    {currentStep === AUTHOR_STEP && (
                        <Stack
                            spacing={2}
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

                <Box>
                    {currentStep === TARGET_STEP ||
                    (currentStep === COMMENT_STEP && initialValue === null) ? (
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
                    {currentStep === KIND_STEP && (
                        <Button
                            type="button"
                            onClick={() => {
                                handleBack();
                                form.reset();
                            }}
                            disabled={isSubmitting}
                            startIcon={<ChevronLeftIcon />}
                        >
                            {translate('back')}
                        </Button>
                    )}

                    {currentStep === AUTHOR_STEP && (
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
                    )}
                    {[COMMENT_STEP, VALUE_STEP].includes(currentStep) && (
                        <Button
                            type="button"
                            onClick={handleNext}
                            disabled={!enableNextButton}
                            endIcon={<ChevronRightIcon />}
                        >
                            {translate('next')}
                        </Button>
                    )}
                </Box>
            </Stack>
        </Popover>
    );
}

CreateAnnotationModal.propTypes = {
    isSubmitting: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    onSubmit: PropTypes.func.isRequired,
    anchorEl: PropTypes.object.isRequired,
    initialValue: PropTypes.any,
};
