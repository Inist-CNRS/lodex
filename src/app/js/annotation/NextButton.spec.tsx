import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestI18N } from '../i18n/I18NContext';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';
import { NextButton } from './NextButton';

// @ts-expect-error TS7006
const renderNextButton = (props) => {
    // @ts-expect-error TS7006
    function TestNextButton(props) {
        return (
            <TestI18N>
                <NextButton
                    initialValue="initial value"
                    isSubmitting={false}
                    disableSubmit={false}
                    goToStep={() => {}}
                    {...props}
                />
            </TestI18N>
        );
    }
    return render(<TestNextButton {...props} />);
};

describe('NextButton', () => {
    describe('TARGET_STEP', () => {
        it('should render no button when currentStep is TARGET_STEP', () => {
            renderNextButton({
                currentStep: TARGET_STEP,
            });
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            expect(screen.queryByText('next')).not.toBeInTheDocument();
        });
    });

    describe('AUTHOR_STEP', () => {
        it('should display enabled validate button when and isAuthorStepValid is true', async () => {
            renderNextButton({
                currentStep: AUTHOR_STEP,
                isAuthorStepValid: true,
            });
            expect(screen.queryByText('validate')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeDisabled();
            expect(screen.queryByText('next')).not.toBeInTheDocument();
        });
        it('should display disabled validate button when and isAuthorStepValid is false', async () => {
            renderNextButton({
                currentStep: AUTHOR_STEP,
                isAuthorStepValid: false,
                isSubmitting: false,
                disableSubmit: true,
            });
            expect(screen.queryByText('validate')).toBeInTheDocument();
            expect(screen.queryByText('validate')).toBeDisabled();
            expect(screen.queryByText('next')).not.toBeInTheDocument();
        });
        it('should display disabled validate button when isSubmitting is true', async () => {
            renderNextButton({
                currentStep: AUTHOR_STEP,
                isAuthorStepValid: true,
                isSubmitting: true,
                disableSubmit: false,
            });
            expect(screen.queryByText('validate')).toBeInTheDocument();
            expect(screen.queryByText('validate')).toBeDisabled();
            expect(screen.queryByText('next')).not.toBeInTheDocument();
        });
        it('should display disabled validate button when disableSubmit is true', async () => {
            renderNextButton({
                currentStep: AUTHOR_STEP,
                isAuthorStepValid: true,
                isSubmitting: false,
                disableSubmit: true,
            });
            expect(screen.queryByText('validate')).toBeInTheDocument();
            expect(screen.queryByText('validate')).toBeDisabled();
            expect(screen.queryByText('next')).not.toBeInTheDocument();
        });
    });

    describe('VALUE_STEP', () => {
        it('should display next button leading to COMMENT_STEP when isValueStepValid is true', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: VALUE_STEP,
                goToStep,
                isValueStepValid: true,
                isSubmitting: false,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            // @ts-expect-error TS2345
            fireEvent.click(screen.queryByText('next'));
            expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        });
        it('should display disabled next button when isValueStepValid is false', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: VALUE_STEP,
                goToStep,
                isValueStepValid: false,
                isSubmitting: false,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            expect(screen.queryByText('next')).toBeDisabled();
        });
        it('should display disabled next button when isSubmitting is true', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: VALUE_STEP,
                goToStep,
                isValueStepValid: true,
                isSubmitting: true,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            expect(screen.queryByText('next')).toBeDisabled();
        });
    });

    describe('COMMENT_STEP', () => {
        it('should display next button leading to AUTHOR_STEP when isCommentStepValid is true', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: COMMENT_STEP,
                goToStep,
                isCommentStepValid: true,
                isSubmitting: false,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            // @ts-expect-error TS2345
            fireEvent.click(screen.queryByText('next'));
            expect(goToStep).toHaveBeenCalledWith(AUTHOR_STEP);
        });
        it('should display disabled next button when isCommentStepValid is false', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: COMMENT_STEP,
                goToStep,
                isCommentStepValid: false,
                isSubmitting: false,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            expect(screen.queryByText('next')).toBeDisabled();
        });
        it('should display disabled next button when isSubmitting is true', async () => {
            const goToStep = jest.fn();
            renderNextButton({
                currentStep: COMMENT_STEP,
                goToStep,
                isCommentStepValid: true,
                isSubmitting: true,
            });
            expect(screen.queryByText('next')).toBeInTheDocument();
            expect(screen.queryByText('validate')).not.toBeInTheDocument();
            expect(screen.queryByText('next')).toBeDisabled();
        });
    });
});
