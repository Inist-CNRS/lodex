import { TextField } from '@mui/material';

type FormSelectFieldProps = {
    input: {
        name: string;
        value: any;
        onChange(...args: unknown[]): unknown;
        onBlur(...args: unknown[]): unknown;
        onFocus(...args: unknown[]): unknown;
    };
    label: string;
    hint?: string;
    meta: {
        touched: boolean;
        error?: boolean;
    };
    [key: string]: any;
};

const FormSelectField = ({
    input,
    label,
    hint,
    meta: { touched, error },
    ...props
}: FormSelectFieldProps) => (
    <TextField
        select
        fullWidth
        label={label}
        helperText={hint}
        error={touched && error}
        {...input}
        onChange={(e) => input.onChange(e.target.value)}
        {...props}
    />
);

FormSelectField.defaultProps = {
    label: '',
};

export default FormSelectField;
