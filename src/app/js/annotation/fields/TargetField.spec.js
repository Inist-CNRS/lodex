import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestI18N } from '../../i18n/I18NContext';
import { TargetField } from './TargetField';
import { useForm } from '@tanstack/react-form';
import { COMMENT_STEP, KIND_STEP } from '../steps';

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
    it('should display choice to target value or whole section', async () => {
        renderTargetField({});
        expect(
            screen.getByText('annotation_comment_target_title'),
        ).toBeInTheDocument();
        expect(
            screen.getByText('annotation_comment_target_value'),
        ).toBeInTheDocument();
    });

    it('should call goToStep with COMMENT_STEP when targeting title and set target to title, initialValue to null', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({ goToStep });
        fireEvent.click(screen.getByText('annotation_comment_target_title'));
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'title',
            kind: 'comment',
            initialValue: null,
        });
    });

    it('should call goToStep with KIND_STEP when targeting value and initialValue is not an array and set initialValue', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: 'initial value',
        });
        fireEvent.click(screen.getByText('annotation_comment_target_value'));
        expect(goToStep).toHaveBeenCalledWith(KIND_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            initialValue: 'initial value',
        });
    });

    it('should call goToStep with KIND_STEP when targeting value an initialValue is an array but not set any initialValue', async () => {
        const goToStep = jest.fn();
        const { form } = renderTargetField({
            goToStep,
            initialValue: ['a', 'b'],
        });
        fireEvent.click(screen.getByText('annotation_comment_target_value'));
        expect(goToStep).toHaveBeenCalledWith(KIND_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'value',
            initialValue: null,
        });
    });
});
