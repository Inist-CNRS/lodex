import { Switch, FormControlLabel } from '@mui/material';
import memoize from 'lodash/memoize';

const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value.toString().toLowerCase() === 'true';
});

type FormSwitchFieldProps = {
    input: {
        name: string;
        value: any;
        onChange(...args: unknown[]): unknown;
        onBlur(...args: unknown[]): unknown;
        onFocus(...args: unknown[]): unknown;
    };
    label: string;
    meta?: {
        touched?: boolean;
        error?: string;
    };
    [key: string]: any;
};

const FormSwitchField = ({
    input,
    label,
    meta,
    ...custom
}: FormSwitchFieldProps) => (
    <FormControlLabel
        control={
            <Switch
                sx={{ marginLeft: 2 }}
                checked={isChecked(input.value)}
                onChange={input.onChange}
                {...custom}
            />
        }
        label={label}
    />
);

export default FormSwitchField;
