import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';
import { TestI18N } from '../../i18n/I18NContext';
import { useForm } from '@tanstack/react-form';
import { COMMENT_STEP, KIND_STEP } from '../steps';
import { KindField } from './KindField';

const renderKindField = (props) => {
    let form;

    function TestTargetField({ ...props }) {
        form = useForm();
        return (
            <TestI18N>
                <KindField
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
    it('should display choice to remove a value', async () => {
        renderKindField({});
        expect(
            screen.getByText('annotation_remove_content'),
        ).toBeInTheDocument();
    });

    it('should call goToStep with COMMENT_STEP when removing a value and there is a single value', async () => {
        const goToStep = jest.fn();
        const { form } = renderKindField({ goToStep });
        fireEvent.click(screen.getByText('annotation_comment_target_title'));
        expect(goToStep).toHaveBeenCalledWith(COMMENT_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'title',
            kind: 'comment',
            initialValue: null,
        });
    });

    it('should call goToStep with VALUE_STEP when removing a value and there are multiple values', async () => {
        const goToStep = jest.fn();
        const { form } = renderKindField({
            goToStep,
            initialValue: ['a', 'b'],
        });
        fireEvent.click(screen.getByText('annotation_comment_target_title'));
        expect(goToStep).toHaveBeenCalledWith(KIND_STEP);
        expect(form.state.values).toStrictEqual({
            target: 'title',
            kind: 'comment',
            initialValue: null,
        });
    });
});
