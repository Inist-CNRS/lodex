import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { useForm } from '@tanstack/react-form';
import { TestI18N } from '../i18n/I18NContext';
import { PreviousButton } from './PreviousButton';
import { AUTHOR_STEP, COMMENT_STEP, TARGET_STEP, VALUE_STEP } from './steps';

const renderPreviousButton = ({ formTarget, formKind, ...props }) => {
    let form;

    function TestPreviousButton(props) {
        form = useForm({
            defaultValues: {
                target: formTarget,
                kind: formKind,
            },
        });
        return (
            <TestI18N>
                <PreviousButton
                    form={form}
                    initialValue="initial value"
                    goToStep={() => {}}
                    {...props}
                />
            </TestI18N>
        );
    }
    const wrapper = render(<TestPreviousButton {...props} />);

    return {
        form,
        ...wrapper,
    };
};

describe('PreviousButton', () => {
    it('should display cancel button when currentStep is TARGET_STEP', async () => {
        const onCancel = jest.fn();
        renderPreviousButton({
            currentStep: TARGET_STEP,
            onCancel,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('cancel')).toBeInTheDocument();
        expect(screen.queryByText('back')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
    it('should display cancel button when currentStep is COMMENT_STEP and isFieldValueAnnotable is false', async () => {
        const onCancel = jest.fn();
        renderPreviousButton({
            currentStep: TARGET_STEP,
            onCancel,
            isFieldValueAnnotable: false,
        });
        expect(screen.queryByText('cancel')).toBeInTheDocument();
        expect(screen.queryByText('back')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('cancel'));
        expect(onCancel).toHaveBeenCalledTimes(1);
    });
    it('should display back button returning to TARGET_STEP when currentStep is VALUE_STEP', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: VALUE_STEP,
            goToStep,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to TARGET_STEP when currentStep is COMMENT_STEP and form target is "title"', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            goToStep,
            formTarget: 'title',
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to TARGET_STEP when currentStep is COMMENT_STEP and form target is "title" even if initialValue is an array', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            goToStep,
            formTarget: 'title',
            initialValue: ['a', 'b'],
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to VALUE_STEP when currentStep is COMMENT_STEP and initialValue is an array', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            initialValue: ['a', 'b'],
            goToStep,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(VALUE_STEP);
    });
    it('should display back button returning to TARGET_STEP when currentStep is COMMENT_STEP and kind is addition even when initialValue is an array', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            initialValue: ['a', 'b'],
            goToStep,
            formKind: 'addition',
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to TARGET_STEP when currentStep is COMMENT_STEP and initialValue is not an array', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            initialValue: 'initialValue',
            goToStep,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to TARGET_STEP when currentStep is COMMENT_STEP and target is title even if initialValue is an array', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: COMMENT_STEP,
            initialValue: ['initialValue'],
            formTarget: 'title',
            goToStep,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(TARGET_STEP);
    });
    it('should display back button returning to COMMENT_STEP when currentStep is AUTHOR_STEP', async () => {
        const goToStep = jest.fn();

        renderPreviousButton({
            currentStep: AUTHOR_STEP,
            goToStep,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
        fireEvent.click(screen.queryByText('back'));
        expect(goToStep).toHaveBeenCalledTimes(1);
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
    });
    it('should disable cancel button when isSubmitting is true', () => {
        renderPreviousButton({
            currentStep: TARGET_STEP,
            isSubmitting: true,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('cancel')).toBeInTheDocument();
        expect(screen.queryByText('cancel')).toBeDisabled();
        expect(screen.queryByText('back')).not.toBeInTheDocument();
    });
    it('should disable back button when isSubmitting is true', () => {
        renderPreviousButton({
            currentStep: AUTHOR_STEP,
            isSubmitting: true,
            isFieldValueAnnotable: true,
        });
        expect(screen.queryByText('back')).toBeInTheDocument();
        expect(screen.queryByText('back')).toBeDisabled();
        expect(screen.queryByText('cancel')).not.toBeInTheDocument();
    });
});
