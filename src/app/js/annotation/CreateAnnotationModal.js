import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutline';
import {
    Box,
    IconButton,
    Popover,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    annotationCreationSchema,
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { ConfirmPopup } from '../lib/components/ConfirmPopup';
import { AnnotationCommentStep } from './AnnotationCommentStep';
import { AuthorEmailField } from './fields/AuthorEmailField';
import { AuthorNameField } from './fields/AuthorNameField';
import { AuthorRememberMeField } from './fields/AuthorRememberMeField';
import { TargetField } from './fields/TargetField';
import { ValueField } from './fields/ValueField';
import { NextButton } from './NextButton';
import { OpenHistoryButton } from './OpenHistoryButton';
import { PreviousButton } from './PreviousButton';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';
import { useContributorCache } from './useContributorCache';
import { useReCaptcha } from './useReCaptacha';

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
    isFieldValueAnnotable,
    openHistory,
}) {
    const { translate } = useTranslate();
    const { requestReCaptchaToken } = useReCaptcha();

    const { contributor, updateContributorCache } = useContributorCache();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);

    const form = useForm({
        defaultValues: {
            resourceUri,
            comment: '',
            target: 'title',
            kind: 'comment',
        },
        onSubmit: async ({ value: { authorRememberMe, ...value } }) => {
            const reCaptchaToken = await requestReCaptchaToken();
            updateContributorCache({ authorRememberMe, ...value });
            await onSubmit({
                ...value,
                reCaptchaToken,
            });
            resetForm();
        },
        validators: {
            onChange: annotationCreationSchema,
        },
    });

    const [currentStep, setCurrentStep] = useState(
        isFieldValueAnnotable ? TARGET_STEP : COMMENT_STEP,
    );

    // Using an effect triggers field validation on form initialization to enable submit button
    // We need to bind the values at the author step, otherwise the form cannot be submitted for some obscure reason
    useEffect(() => {
        if (currentStep !== AUTHOR_STEP || !contributor?.authorRememberMe) {
            return;
        }

        for (const [key, value] of Object.entries(contributor || {})) {
            form.setFieldValue(key, value);
        }
        form.validate();
    }, [currentStep, form, contributor]);

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

    const handleOpenConfirm = () => {
        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
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
        <>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('close')}
                title={translate('annotation_cancel_confirm_title')}
                description={translate('annotation_cancel_confirm_content')}
                onCancel={handleCloseConfirm}
                onConfirm={handleClose}
            />

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
                BackdropProps={{
                    sx: {
                        backgroundColor: 'rgba(0, 0, 0, 0.05)',
                    },
                }}
                role="dialog"
            >
                <form.Field name="resourceUri">
                    {(field) => (
                        <input
                            type="hidden"
                            value={field.state.value}
                            readOnly
                        />
                    )}
                </form.Field>
                <Stack gap={2}>
                    <Stack gap={1} direction="row" alignItems="center">
                        <Typography variant="h6" color="text.gray">
                            {translate('annotation_annotate_field', {
                                field: field.label,
                            })}
                        </Typography>
                        <Box flexGrow={1} />
                        <IconButton
                            onClick={handleOpenConfirm}
                            aria-label={translate('close')}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>

                    <Box fullWidth role="tabpanel">
                        {currentStep === TARGET_STEP && (
                            <Stack
                                spacing={2}
                                aria-label={translate('annotation_step_target')}
                                role="tab"
                            >
                                <OpenHistoryButton
                                    field={field}
                                    resourceUri={resourceUri}
                                    openHistory={openHistory}
                                />
                                <TargetField
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
                                <ValueField
                                    choices={initialValue}
                                    form={form}
                                />
                            </Stack>
                        )}
                        {currentStep === COMMENT_STEP && (
                            <Stack
                                spacing={2}
                                aria-label={translate(
                                    'annotation_step_comment',
                                )}
                                role="tab"
                            >
                                {!initialValue && (
                                    <Stack spacing={2}>
                                        <OpenHistoryButton
                                            field={field}
                                            resourceUri={resourceUri}
                                            openHistory={openHistory}
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
                                <Stack
                                    direction="row"
                                    gap={1}
                                    alignItems="center"
                                >
                                    <Typography>
                                        {translate(
                                            'annotation_personal_information',
                                        )}
                                    </Typography>
                                    <Tooltip
                                        title={translate(
                                            'annotation_personal_information_tooltip',
                                        )}
                                    >
                                        <HelpIcon fontSize="1.125rem" />
                                    </Tooltip>
                                </Stack>
                                <AuthorNameField form={form} />
                                <AuthorEmailField form={form} />
                                <AuthorRememberMeField form={form} />
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
                            onCancel={handleOpenConfirm}
                            isFieldValueAnnotable={isFieldValueAnnotable}
                        />

                        <NextButton
                            isAuthorStepValid={isAuthorStepValid}
                            isCommentStepValid={isCommentStepValid}
                            isValueStepValid={isValueStepValid}
                            currentStep={currentStep}
                            goToStep={setCurrentStep}
                            isSubmitting={isSubmitting}
                            disableSubmit={disableSubmit}
                            form={form}
                        />
                    </Box>
                </Stack>
            </Popover>
        </>
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
    isFieldValueAnnotable: PropTypes.bool.isRequired,
    openHistory: PropTypes.func.isRequired,
};
