import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { z } from 'zod';
const { useForm } = require('@tanstack/react-form');
const { TextField } = require('./TextField');
const { TestI18N } = require('../../i18n/I18NContext');

const renderTextField = (props) => {
    let form;

    function TestTargetField({ ...props }) {
        form = useForm({
            defaultValues: {
                name: 'value',
            },
        });
        return (
            <TestI18N>
                <TextField form={form} {...props} />
            </TestI18N>
        );
    }
    const wrapper = render(<TestTargetField {...props} />);

    return {
        form,
        ...wrapper,
    };
};

describe('TextField', () => {
    it('should render the TextField component', () => {
        const wrapper = renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
        });
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByLabelText('label')).toBeInTheDocument();
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
    });
    it('should render an error message in place of the helperText when field value become invalid', () => {
        const schema = z.object({
            name: z.string().min(10, 'error_from_validator'),
        });
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

        const wrapper = render(
            <TestTargetField
                label="label"
                name="name"
                helperText="helperText"
            />,
        );
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
        fireEvent.change(wrapper.getByLabelText('label'), {
            target: { value: 'value' },
        });
        expect(wrapper.queryByText('helperText')).not.toBeInTheDocument();
        expect(wrapper.queryByText('error_from_validator')).toBeInTheDocument();
    });
    it('should render an error message in place of the helperText when required is true and there is no value independently of validators', () => {
        function TestTargetField(props) {
            const form = useForm({
                defaultValues: {
                    name: 'value',
                },
            });
            return (
                <TestI18N>
                    <TextField form={form} {...props} />
                </TestI18N>
            );
        }

        const wrapper = render(
            <TestTargetField
                label="label"
                name="name"
                helperText="helperText"
                required
            />,
        );
        expect(wrapper.queryByText('helperText')).toBeInTheDocument();
        fireEvent.change(wrapper.getByLabelText('label'), {
            target: { value: '' },
        });
        expect(wrapper.queryByText('helperText')).not.toBeInTheDocument();
        expect(wrapper.queryByText('error_field_required')).toBeInTheDocument();
    });
});
