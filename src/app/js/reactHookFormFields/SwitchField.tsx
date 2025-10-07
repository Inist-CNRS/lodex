import {
    FormControlLabel,
    Switch as MuiSwitch,
    type SwitchProps as MuiSwitchProps,
} from '@mui/material';
import { useController, useFormContext } from 'react-hook-form';
import memoize from 'lodash/memoize';

const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value.toString().toLowerCase() === 'true';
});

export const SwitchField = ({
    name,
    validate,
    label,
    ...props
}: MuiSwitchProps & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
}) => {
    const { control } = useFormContext();

    const { field } = useController({
        name,
        rules: {
            validate,
        },
        control,
    });

    return (
        <FormControlLabel
            control={
                <MuiSwitch
                    {...props}
                    sx={{ marginLeft: 1.5 }}
                    checked={isChecked(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                />
            }
            label={label}
        />
    );
};
