import { act, fireEvent, render } from '@testing-library/react';
import { z } from 'zod';
import { useForm } from '@tanstack/react-form';
import { TextField, type TextFieldProps } from './TextField';
import { TestI18N } from '@lodex/frontend-common/i18n/I18NContext';

// @ts-expect-error TS7006
const renderTextField = async (props) => {
    let form;

    function TestTargetField({
        formValue = 'value',
        ...props
    }: Omit<TextFieldProps, 'form'> & { formValue?: string }) {
        form = useForm({
            defaultValues: {
                name: formValue,
            },
        });
        return (
            <TestI18N>
                <TextField form={form} {...props} />
            </TestI18N>
        );
    }

    const screen = await act(async () => {
        return render(<TestTargetField {...props} />);
    });

    return {
        form,
        ...screen,
    };
};

describe('TextField', () => {
    it('should render the TextField component', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
        });
        expect(screen.queryByLabelText('label')).toBeInTheDocument();
        expect(screen.queryByLabelText('label')).toHaveValue('value');
        expect(screen.queryByText('helperText')).toBeInTheDocument();
    });
    it('should render the TextField component with given initial value', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            initialValue: 'initialValue',
            formValue: null,
        });
        expect(screen.queryByLabelText('label')).toBeInTheDocument();
        expect(screen.queryByLabelText('label')).toHaveValue('initialValue');
    });
    it('should ignore initial value if form value is already set', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            initialValue: 'initialValue',
            formValue: 'formValue',
        });
        expect(screen.queryByLabelText('label')).toBeInTheDocument();
        expect(screen.queryByLabelText('label')).toHaveValue('formValue');
    });

    it('should display a clear button if clearable is set', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            clearable: true,
        });
        expect(screen.queryByLabelText('label')).toBeInTheDocument();
        expect(screen.queryByLabelText('label')).toHaveValue('value');
        expect(screen.queryByLabelText('clear')).toBeInTheDocument();
        await act(async () => {
            return fireEvent.click(screen.getByLabelText('clear'));
        });
        expect(screen.queryByLabelText('label')).toHaveValue('');
    });

    it('should not display a clear button if clearable is not set', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
        });
        expect(screen.queryByLabelText('label')).toBeInTheDocument();
        expect(screen.queryByLabelText('label')).toHaveValue('value');
        expect(screen.queryByLabelText('clear')).not.toBeInTheDocument();
    });

    it('should render an error message in place of the helperText when field value become invalid', async () => {
        const schema = z.object({
            name: z.string().min(10, 'error_from_validator'),
        });
        function TestTargetField(props: Omit<TextFieldProps, 'form'>) {
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
        let screen;

        await act(async () => {
            screen = render(
                <TestTargetField
                    label="label"
                    name="name"
                    helperText="helperText"
                />,
            );
        });
        // @ts-expect-error TS18048
        expect(screen.queryByText('helperText')).toBeInTheDocument();
        await act(async () => {
            // @ts-expect-error TS7005
            fireEvent.change(screen.getByLabelText('label'), {
                target: { value: 'value' },
            });
        });
        // @ts-expect-error TS18048
        expect(screen.queryByText('helperText')).not.toBeInTheDocument();
        // @ts-expect-error TS18048
        expect(screen.queryByText('error_from_validator')).toBeInTheDocument();
    });
    it('should render an error message in place of the helperText when required is true and there is no value independently of validators', async () => {
        const screen = await renderTextField({
            label: 'label',
            name: 'name',
            helperText: 'helperText',
            required: true,
        });
        expect(screen.queryByText('helperText')).toBeInTheDocument();
        await act(async () => {
            fireEvent.change(screen.getByLabelText('label'), {
                target: { value: '' },
            });
        });
        expect(screen.queryByText('helperText')).not.toBeInTheDocument();
        expect(screen.queryByText('error_field_required')).toBeInTheDocument();
    });
});
