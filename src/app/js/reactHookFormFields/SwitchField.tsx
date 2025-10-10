import {
    FormControlLabel,
    Switch as MuiSwitch,
    type SwitchProps as MuiSwitchProps,
} from '@mui/material';
import { useController } from 'react-hook-form';
import memoize from 'lodash/memoize';
import { useTranslate } from '../i18n/I18NContext.tsx';

const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value?.toString()?.toLowerCase() === 'true';
});

export const SwitchField = ({
    name,
    validate,
    label,
    required = false,
    defaultValue,
    ...props
}: Omit<MuiSwitchProps, 'defaultValue'> & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
    defaultValue?: boolean | string;
}) => {
    const { translate } = useTranslate();
    const { field } = useController({
        name,
        rules: {
            required: required ? translate('error_field_required') : false,
            validate: (value) => {
                if (validate) {
                    return validate(value);
                }
            },
        },
        defaultValue,
    });

    return (
        <FormControlLabel
            control={
                <MuiSwitch
                    {...props}
                    name={name}
                    sx={{ marginLeft: 1.5 }}
                    required={required}
                    checked={isChecked(field.value)}
                    onChange={(e) => field.onChange(e.target.checked)}
                />
            }
            label={label}
        />
    );
};
