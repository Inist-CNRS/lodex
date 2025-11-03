import { TextField } from '@mui/material';
import { type FormFieldProps } from '../../../components/type';

const CodeEdit = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}: FormFieldProps) => (
    <TextField
        variant="standard"
        placeholder={label}
        label={label}
        multiline
        rows={4}
        error={touched && !!error}
        // @ts-expect-error TS2322
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

export default CodeEdit;
