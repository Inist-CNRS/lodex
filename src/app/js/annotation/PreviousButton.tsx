import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import { Button } from '@mui/material';
import { useStore } from '@tanstack/react-form';
// @ts-expect-error TS6133
import React, { useCallback } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';

interface PreviousButtonProps {
    form: object;
    goToStep(...args: unknown[]): unknown;
    onCancel(...args: unknown[]): unknown;
    currentStep: string;
    initialValue?: any;
    isSubmitting: boolean;
    skipAnnotationKindStep: boolean;
}

export const PreviousButton = ({
    currentStep,

    initialValue,

    goToStep,

    onCancel,

    isSubmitting,

    form,

    skipAnnotationKindStep
}: PreviousButtonProps) => {
    const { translate } = useTranslate();

    const kind = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.kind;
    });

    const target = useStore(form.store, (state) => {
        // @ts-expect-error TS18046
        return state.values.target;
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
                    if (skipAnnotationKindStep) {
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
        [
            currentStep,
            goToStep,
            skipAnnotationKindStep,
            target,
            initialValue,
            kind,
        ],
    );

    if (
        currentStep === TARGET_STEP ||
        (currentStep === COMMENT_STEP && skipAnnotationKindStep)
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
