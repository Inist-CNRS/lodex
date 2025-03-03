import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';

export const PreviousButton = ({
    currentStep,
    initialValue,
    goToStep,
    onCancel,
    isSubmitting,
    form,
    isFieldValueAnnotable,
}) => {
    const { translate } = useTranslate();

    const kind = useStore(form.store, (state) => {
        return state.values.kind;
    });

    const handleBack = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            switch (currentStep) {
                case VALUE_STEP: {
                    goToStep(TARGET_STEP);
                    return;
                }
                case COMMENT_STEP: {
                    if (!isFieldValueAnnotable) {
                        return;
                    }
                    if (Array.isArray(initialValue) && kind !== 'addition') {
                        goToStep(VALUE_STEP);
                        return;
                    }
                    goToStep(TARGET_STEP);
                    return;
                }
                case AUTHOR_STEP: {
                    goToStep(COMMENT_STEP);
                    return;
                }
                default:
                    return;
            }
        },
        [currentStep, goToStep, initialValue, kind, isFieldValueAnnotable],
    );

    if (
        currentStep === TARGET_STEP ||
        (currentStep === COMMENT_STEP && !isFieldValueAnnotable)
    ) {
        return (
            <Button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                startIcon={<ChevronLeftIcon />}
            >
                {translate('cancel')}
            </Button>
        );
    }

    return (
        <Button
            type="button"
            onClick={handleBack}
            disabled={isSubmitting}
            startIcon={<ChevronLeftIcon />}
        >
            {translate('back')}
        </Button>
    );
};

PreviousButton.propTypes = {
    form: PropTypes.object.isRequired,
    goToStep: PropTypes.func.isRequired,
    onCancel: PropTypes.func.isRequired,
    currentStep: PropTypes.string.isRequired,
    initialValue: PropTypes.string,
    isSubmitting: PropTypes.bool.isRequired,
    isFieldValueAnnotable: PropTypes.bool.isRequired,
};
