import { TextField } from '@mui/material';
import { FormFieldProps } from './type';

const FormPercentField = ({
    input,
    label,
    meta: { touched, error },
    ...custom
}: FormFieldProps) => (
    <TextField
        sx={{
            width: '30%',
            marginTop: 2,
        }}
        type="number"
        min={10}
        max={100}
        step={10}
        placeholder={label}
        label={label}
        error={touched && !!error}
        // @ts-expect-error TS2322
        helperText={touched && error}
        InputProps={{
            endAdornment: '%',
        }}
        {...input}
        {...custom}
    />
);

export default FormPercentField;
