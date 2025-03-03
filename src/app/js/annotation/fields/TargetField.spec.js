import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestI18N } from '../../i18n/I18NContext';
import { TargetField } from './TargetField';
import { useForm } from '@tanstack/react-form';
import { COMMENT_STEP, VALUE_STEP } from '../steps';
import { act } from 'react-dom/test-utils';

const renderTargetField = (props) => {
    let form;

    function TestTargetField({ ...props }) {
        form = useForm();
        return (
            <TestI18N>
                <TargetField
                    form={form}
                    initialValue="initial value"
                    goToStep={() => {}}
                    {...props}
                />
            </TestI18N>
        );
    }
    const wrapper = render(<TestTargetField {...props} />);

    return {
        form,
        ...wrapper,
    };
};

describe('TargetField', () => {
    it('should display choice to comment, correct, add or remove', () => {
        renderTargetField({});
        expect(
            screen.getByText('annotation_comment_target_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('annotation_correct_content'),
        ).toBeInTheDocument();
        expect(screen.getByText('annotation_add_content')).toBeInTheDocument();
        expect(
            screen.getByText('annotation_remove_content'),
        ).toBeInTheDocument();
    });

    it('should call goToStep with COMMENT_STEP when targeting title and set target to title, kind to comment, initialValue to null', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        act(() => {
            fireEvent.click(
                screen.getByText('annotation_comment_target_title'),
            );
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'title',
            kind: 'comment',
            initialValue: null,
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_correct_content, and set target to value, kind to correction, initialValue to "initialValue"', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_correct_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'correction',
            initialValue: 'initial value',
        });
    });

    it('should call goToStep with VALUE_STEP when there is an array of values and clicking on annotation_correct_content, and set target to value, kind to correction', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_correct_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(VALUE_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'correction',
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_remove_content, and set target to value, kind to removal, initialValue to "initial value"', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_remove_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'removal',
            initialValue: 'initial value',
        });
    });

    it('should call goToStep with VALUE_STEP when there is an array of values and clicking on annotation_remove_content, and set target to value, kind to removal', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_remove_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(VALUE_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'removal',
        });
    });

    it('should call goToStep with COMMENT_STEP when there is a single value and clicking on annotation_add_content, and set target to value, kind to addition, initialValue to null', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_add_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'addition',
            initialValue: null,
        });
    });

    it('should call goToStep with COMMENT_STEP when there is an array of values and clicking on annotation_add_content, and set target to value, kind to addition, initialValue to null', () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['initial', 'value'],
        });
        act(() => {
            fireEvent.click(screen.getByText('annotation_add_content'));
        });
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            kind: 'addition',
            initialValue: null,
        });
    });
});
