import { Button, CircularProgress } from '@mui/material';
import { useCallback, useMemo } from 'react';
import SaveIcon from '@mui/icons-material/Save';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';
import { useTranslate } from '../i18n/I18NContext';

interface NextButtonProps {
    goToStep(...args: unknown[]): unknown;
    currentStep: string;
    isSubmitting: boolean;
    disableSubmit: boolean;
    isAuthorStepValid: boolean;
    isValueStepValid: boolean;
    isCommentStepValid: boolean;
}

export const NextButton = ({
    currentStep,

    disableSubmit,

    goToStep,

    isSubmitting,

    isValueStepValid,

    isCommentStepValid,

    isAuthorStepValid,
}: NextButtonProps) => {
    const { translate } = useTranslate();
    const handleNext = useCallback(
        // @ts-expect-error TS7006
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

    const enableNextButton = useMemo(() => {
        if (currentStep === COMMENT_STEP) {
            return isCommentStepValid;
        }
        if (currentStep === VALUE_STEP) {
            return isValueStepValid;
        }

        return false;
    }, [currentStep, isCommentStepValid, isValueStepValid]);

    if ([TARGET_STEP].includes(currentStep)) {
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
