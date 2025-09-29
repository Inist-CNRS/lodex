import CloseIcon from '@mui/icons-material/Close';
import HelpIcon from '@mui/icons-material/HelpOutline';
import {
    Box,
    IconButton,
    LinearProgress,
    Popover,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { useForm, useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React, { useEffect, useMemo, useState } from 'react';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_CORRECTION,
    annotationCreationSchema,
    // @ts-expect-error TS7016
} from '../../../common/validator/annotation.validator';
import { useTranslate } from '../i18n/I18NContext';
import { ConfirmPopup } from '../lib/components/ConfirmPopup';
import { AnnotationCommentStep } from './AnnotationCommentStep';
import { CreateAnnotationTitle } from './CreateAnnotationTitle';
import { AuthorEmailField } from './fields/AuthorEmailField';
import { AuthorNameField } from './fields/AuthorNameField';
import { AuthorRememberMeField } from './fields/AuthorRememberMeField';
import { TargetField } from './fields/TargetField';
import { ValueField } from './fields/ValueField';
import { NextButton } from './NextButton';
import { OpenHistoryButton } from './OpenHistoryButton';
import { PreviousButton } from './PreviousButton';
import {
    AUTHOR_STEP,
    COMMENT_STEP,
    progressByStep,
    TARGET_STEP,
    VALUE_STEP,
} from './steps';
import { useContributorCache } from './useContributorCache';
import { useReCaptcha } from './useReCaptacha';
import { IsContributorNamePublicField } from './fields/IsContributorNamePublicField';

// @ts-expect-error TS7006
const isRequiredFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return fieldState.isTouched && fieldState.errors.length === 0;
};

// @ts-expect-error TS7006
const isOptionalFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return !fieldState.isTouched || fieldState.errors.length === 0;
};

export function CreateAnnotationModal({
    // @ts-expect-error TS7031
    isSubmitting,
    // @ts-expect-error TS7031
    onSubmit,
    // @ts-expect-error TS7031
    anchorEl,
    // @ts-expect-error TS7031
    onClose,
    // @ts-expect-error TS7031
    initialValue,
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    resourceUri,
    // @ts-expect-error TS7031
    isFieldValueAnnotable,
    // @ts-expect-error TS7031
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
        // @ts-expect-error TS2339
        onSubmit: async ({ value: { authorRememberMe, ...value } }) => {
            const reCaptchaToken = await requestReCaptchaToken();
            updateContributorCache({ authorRememberMe, ...value });
            await onSubmit({
                ...value,
                reCaptchaToken,
            });
            // eslint-disable-next-line no-use-before-define
            resetForm();
        },
        validators: {
            onChange: annotationCreationSchema,
        },
    });

    const skipAnnotationKindStep = useMemo(() => {
        const {
            enableAnnotationKindCorrection,
            enableAnnotationKindAddition,
            enableAnnotationKindRemoval,
        } = field;
        return (
            !isFieldValueAnnotable ||
            (enableAnnotationKindCorrection === false &&
                enableAnnotationKindAddition === false &&
                enableAnnotationKindRemoval === false)
        );
    }, [isFieldValueAnnotable, field]);

    const [currentStep, setCurrentStep] = useState(
        skipAnnotationKindStep ? COMMENT_STEP : TARGET_STEP,
    );

    // Using an effect triggers field validation on form initialization to enable submit button
    // We need to bind the values at the author step, otherwise the form cannot be submitted for some obscure reason
    useEffect(() => {
        if (currentStep !== AUTHOR_STEP || !contributor?.authorRememberMe) {
            return;
        }

        for (const [key, value] of Object.entries(contributor || {})) {
            // @ts-expect-error TS2345
            form.setFieldValue(key, value);
        }
        // @ts-expect-error TS2554
        form.validate();
    }, [currentStep, form, contributor]);

    const isValueStepValid = useStore(form.store, (state) => {
        if (currentStep !== VALUE_STEP) {
            return true;
        }

        // tanstack form does not support conditional validation (e.g. validation using superRefine to depend on another field value)
        // @ts-expect-error TS2339
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
                // @ts-expect-error TS2339
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
        // @ts-expect-error TS2345
        setCurrentStep(0);
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleOpenConfirm = () => {
        if (!form.state.isDirty) {
            return handleClose();
        }

        setIsConfirmOpen(true);
    };

    const handleCloseConfirm = () => {
        setIsConfirmOpen(false);
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
            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [currentStep]);

    return (
        <>
            <ConfirmPopup
                isOpen={isConfirmOpen}
                cancelLabel={translate('continue_annotation')}
                confirmLabel={translate('confirm_and_close')}
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
                    // @ts-expect-error TS2353
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
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    },
                }}
                role="dialog"
            >
                {/*
                 // @ts-expect-error TS2786 */}
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
                    <Stack direction="row" alignItems="center" gap={1}>
                        <Box flexGrow={1}>
                            <LinearProgress
                                variant="determinate"
                                // @ts-expect-error TS7053
                                value={progressByStep[currentStep]}
                            />
                        </Box>

                        <IconButton
                            onClick={handleOpenConfirm}
                            aria-label={translate('close')}
                        >
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                    <Stack gap={1} direction="row" alignItems="center">
                        <CreateAnnotationTitle
                            fieldLabel={field.label}
                            form={form}
                            step={currentStep}
                        />

                        {currentStep === COMMENT_STEP && (
                            <Tooltip title={translate('public_annotation')}>
                                {/*
                                 // @ts-expect-error TS2769 */}
                                <HelpIcon fontSize="1.125rem" />
                            </Tooltip>
                        )}
                    </Stack>

                    {/*
                     // @ts-expect-error TS2769 */}
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
                                    field={field}
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
                                {skipAnnotationKindStep && (
                                    <OpenHistoryButton
                                        field={field}
                                        resourceUri={resourceUri}
                                        openHistory={openHistory}
                                    />
                                )}
                                <Stack spacing={2}>
                                    <AnnotationCommentStep
                                        form={form}
                                        field={field}
                                        initialValue={initialValue}
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
                                        {/*
                                         // @ts-expect-error TS2769 */}
                                        <HelpIcon fontSize="1.125rem" />
                                    </Tooltip>
                                </Stack>
                                <AuthorNameField form={form} />
                                <AuthorEmailField form={form} />
                                <IsContributorNamePublicField form={form} />
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
                            skipAnnotationKindStep={skipAnnotationKindStep}
                        />

                        <NextButton
                            isAuthorStepValid={isAuthorStepValid}
                            isCommentStepValid={isCommentStepValid}
                            isValueStepValid={isValueStepValid}
                            currentStep={currentStep}
                            goToStep={setCurrentStep}
                            isSubmitting={isSubmitting}
                            disableSubmit={disableSubmit}
                            // @ts-expect-error TS2322
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
