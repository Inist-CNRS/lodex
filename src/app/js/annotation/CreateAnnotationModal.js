import { Box, Popover, Stack, Typography } from '@mui/material';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    annotationCreationSchema,
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { AnnotationCommentStep } from './AnnotationCommentStep';
import { AuthorEmailField } from './fields/AuthorEmailField';
import { AuthorNameField } from './fields/AuthorNameField';
import { KindField } from './fields/KindField';
import { TargetField } from './fields/TargetField';
import { ValueField } from './fields/ValueField';
import { NextButton } from './NextButton';
import { PreviousButton } from './PreviousButton';
import {
    AUTHOR_STEP,
    COMMENT_STEP,
    KIND_STEP,
    TARGET_STEP,
    VALUE_STEP,
} from './steps';
import { ValueField } from './fields/ValueField';
import { KindField } from './fields/KindField';
import { PreviousButton } from './PreviousButton';
import { NextButton } from './NextButton';
import { AnnotationCommentStep } from './AnnotationCommentStep';
import { OpenHistoricButton } from './OpenHistoricButton';

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
    onSubmit,
    anchorEl,
    onClose,
    initialValue,
    field,
    resourceUri,
}) {
    const { translate } = useTranslate();

    const form = useForm({
        defaultValues: {
            comment: '',
            target: 'title',
            kind: 'comment',
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

        if (
            [ANNOTATION_KIND_CORRECTION, ANNOTATION_KIND_ADDITION].includes(
                state.values.kind,
            )
        ) {
            return (
                !!state.values.proposedValue &&
                isRequiredFieldValid(state, 'comment')
            );
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
                            <OpenHistoricButton
                                field={field}
                                resourceUri={resourceUri}
                            />
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
                            <KindField
                                form={form}
                                goToStep={setCurrentStep}
                                initialValue={initialValue}
                            />
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
                            {!initialValue && (
                                <Stack spacing={2}>
                                    <OpenHistoricButton
                                        field={field}
                                        resourceUri={resourceUri}
                                    />
                                </Stack>
                            )}
                            <Stack spacing={2}>
                                <AnnotationCommentStep
                                    form={form}
                                    field={field}
                                />
                            </Stack>
                        </Stack>
                    )}

                    {currentStep === AUTHOR_STEP && (
                        <Stack
                            spacing={2}
                            aria-label={translate('annotation_step_author')}
                            role="tab"
                        >
                            <AuthorNameField form={form} />
                            <AuthorEmailField form={form} />
                        </Stack>
                    )}
                </Box>

                <Box display="flex" justifyContent="space-between">
                    <PreviousButton
                        form={form}
                        currentStep={currentStep}
                        goToStep={setCurrentStep}
                        initialValue={initialValue}
                        isSubmitting={isSubmitting}
                        onCancel={handleClose}
                    />

                    <NextButton
                        isAuthorStepValid={isAuthorStepValid}
                        isCommentStepValid={isCommentStepValid}
                        isValueStepValid={isValueStepValid}
                        currentStep={currentStep}
                        goToStep={setCurrentStep}
                        initialValue={initialValue}
                        isSubmitting={isSubmitting}
                        disableSubmit={disableSubmit}
                        form={form}
                    />
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
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
