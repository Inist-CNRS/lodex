import { TextField } from '@mui/material';
import { type FormField } from '../../../propTypes';

const CodeEdit = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}: FormField) => (
    <TextField
        variant="standard"
        placeholder={label}
        label={label}
        multiline
        rows={4}
        error={touched && !!error}
        helperText={touched && error}
        {...input}
        {...custom}
    />
);

export default CodeEdit;
