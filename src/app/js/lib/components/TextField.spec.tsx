// @ts-expect-error TS6133
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { z } from 'zod';
import PropTypes from 'prop-types';
import { useForm } from '@tanstack/react-form';
import { TextField } from './TextField';
import { TestI18N } from '../../i18n/I18NContext';

// @ts-expect-error TS7006
const renderTextField = async (props) => {
    let form;

    function TestTargetField({ formValue = 'value', ...props }) {
        form = useForm({
            defaultValues: {
                name: formValue,
            },
        });
        return (
            <TestI18N>
                {/* 
                // @ts-expect-error TS2322 */}
                <TextField form={form} {...props} />
            </TestI18N>
        );
    }

    TestTargetField.propTypes = {
        formValue: PropTypes.string,
    };
    let wrapper;

    await act(async () => {
        wrapper = render(<TestTargetField {...props} />);
    });

    return {
        form,
        // @ts-expect-error TS2698
        ...wrapper,
    };
};

describe('TextField', () => {
    it('should render the TextField component', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toHaveValue('value');
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
    });
    it('should render the TextField component with given initial value', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            initialValue: 'initialValue',
            formValue: null,
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toHaveValue('initialValue');
    });
    it('should ignore initial value if form value is already set', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            initialValue: 'initialValue',
            formValue: 'formValue',
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toHaveValue('formValue');
    });

    it('should display a clear button if clearable is set', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            clearable: true,
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toHaveValue('value');
        expect(wrapper.queryByLabelText('clear')).toBeInTheDocument();
        // @ts-expect-error TS2769
        await act(async () => {
            return fireEvent.click(wrapper.queryByLabelText('clear'));
        });
        expect(wrapper.queryByLabelText('label')).toHaveValue('');
    });

    it('should not display a clear button if clearable is not set', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toHaveValue('value');
        expect(wrapper.queryByLabelText('clear')).not.toBeInTheDocument();
    });

    it('should render an error message in place of the helperText when field value become invalid', async () => {
        const schema = z.object({
            name: z.string().min(10, 'error_from_validator'),
        });
        // @ts-expect-error TS7006
        function TestTargetField(props) {
            const form = useForm({
                validators: {
                    onChange: schema,
                },
            });
            return (
                <TestI18N>
                    <TextField form={form} {...props} />
                </TestI18N>
            );
        }

        // @ts-expect-error TS7034
        let wrapper;

        await act(async () => {
            wrapper = render(
                <TestTargetField
                    label="label"
                    name="name"
                    helperText="helperText"
                />,
            );
        });
        // @ts-expect-error TS18048
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
        await act(async () => {
            // @ts-expect-error TS7005
            fireEvent.change(wrapper.getByLabelText('label'), {
                target: { value: 'value' },
            });
        });
        // @ts-expect-error TS18048
        expect(wrapper.queryByText('helperText')).not.toBeInTheDocument();
        // @ts-expect-error TS18048
        expect(wrapper.queryByText('error_from_validator')).toBeInTheDocument();
    });
    it('should render an error message in place of the helperText when required is true and there is no value independently of validators', async () => {
        const wrapper = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            required: true,
        });
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
        await act(async () => {
            fireEvent.change(wrapper.getByLabelText('label'), {
                target: { value: '' },
            });
        });
        expect(wrapper.queryByText('helperText')).not.toBeInTheDocument();
        expect(wrapper.queryByText('error_field_required')).toBeInTheDocument();
    });
});
