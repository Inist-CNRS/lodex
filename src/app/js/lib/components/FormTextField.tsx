import { TextField } from '@mui/material';

type FormTextFieldProps = {
    input: {
        name: string;
        value: any;
        onChange(...args: unknown[]): unknown;
        onBlur(...args: unknown[]): unknown;
        onFocus(...args: unknown[]): unknown;
    };
    label: string;
    meta: {
        touched: boolean;
        error?: string;
    };
    p?: any;
    dispatch?: (...args: unknown[]) => unknown;
    [key: string]: any;
};

const FormTextField = ({
    input,
    label,
    meta: { touched, error },
    p,
    dispatch,
    ...custom
}: FormTextFieldProps) => (
    <TextField
        placeholder={label}
        label={label}
        error={touched && !!error}
        helperText={touched && error}
        {...input}
        value={input.value === null ? '' : input.value}
        {...custom}
    />
);

export default FormTextField;
