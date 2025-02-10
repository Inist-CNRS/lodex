import { Button, CircularProgress } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import {
    AUTHOR_STEP,
    COMMENT_STEP,
    KIND_STEP,
    TARGET_STEP,
    VALUE_STEP,
} from './steps';
import { useTranslate } from '../i18n/I18NContext';
import PropTypes from 'prop-types';
import { useStore } from '@tanstack/react-form';

export const isRequiredFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return fieldState.isTouched && fieldState.errors.length === 0;
};

export const isOptionalFieldValid = (formState, fieldName) => {
    const fieldState = formState.fieldMeta[fieldName];
    if (!fieldState) {
        return false;
    }

    return !fieldState.isTouched || fieldState.errors.length === 0;
};

export const NextButton = ({
    currentStep,
    disableSubmit,
    goToStep,
    isSubmitting,
    form,
}) => {
    const { translate } = useTranslate();
    const handleNext = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            switch (currentStep) {
                case VALUE_STEP: {
                    goToStep(COMMENT_STEP);
                    return;
                }
                case COMMENT_STEP: {
                    goToStep(AUTHOR_STEP);
                    return;
                }
                default:
                    return;
            }
        },
        [currentStep, goToStep],
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
        if (currentStep === VALUE_STEP) {
            return isValueStepValid;
        }

        return false;
    }, [currentStep, isCommentStepValid, isValueStepValid]);

    if ([TARGET_STEP, KIND_STEP].includes(currentStep)) {
        return null;
    }

    if (currentStep === AUTHOR_STEP) {
        return (
            <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={disableSubmit || isSubmitting || !isAuthorStepValid}
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
        );
    }

    return (
        <Button
            type="button"
            onClick={handleNext}
            disabled={isSubmitting || !enableNextButton}
            endIcon={<ChevronRightIcon />}
        >
            {translate('next')}
        </Button>
    );
};

NextButton.propTypes = {
    goToStep: PropTypes.func.isRequired,
    currentStep: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
    disableSubmit: PropTypes.bool.isRequired,
    form: PropTypes.object.isRequired,
};
