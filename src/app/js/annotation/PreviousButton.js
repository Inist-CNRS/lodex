import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button } from '@mui/material';
import { useStore } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React, { useCallback } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import {
    AUTHOR_STEP,
    COMMENT_STEP,
    KIND_STEP,
    TARGET_STEP,
    VALUE_STEP,
} from './steps';

export const PreviousButton = ({
    currentStep,
    initialValue,
    goToStep,
    onCancel,
    isSubmitting,
    form,
}) => {
    const { translate } = useTranslate();

    const target = useStore(form.store, (state) => {
        return state.values.target;
    });

    const kind = useStore(form.store, (state) => {
        return state.values.kind;
    });

    const handleBack = useCallback(
        (event) => {
            event.preventDefault();
            event.stopPropagation();
            switch (currentStep) {
                case KIND_STEP: {
                    goToStep(TARGET_STEP);
                    return;
                }
                case VALUE_STEP: {
                    goToStep(KIND_STEP);
                    return;
                }
                case COMMENT_STEP: {
                    if (!initialValue) {
                        return;
                    }
                    if (target === 'title') {
                        goToStep(TARGET_STEP);
                        return;
                    }
                    if (Array.isArray(initialValue) && kind !== 'addition') {
                        goToStep(VALUE_STEP);
                        return;
                    }
                    goToStep(KIND_STEP);
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
        [currentStep, goToStep, initialValue, target],
    );

    if (
        currentStep === TARGET_STEP ||
        (currentStep === COMMENT_STEP && !initialValue)
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
};
