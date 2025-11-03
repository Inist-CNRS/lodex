import {
    FormControlLabel,
    Switch as MuiSwitch,
    type SwitchProps as MuiSwitchProps,
} from '@mui/material';
import { useController } from 'react-hook-form';
import memoize from 'lodash/memoize';
import { useTranslate } from '../i18n/I18NContext';

const isChecked = memoize((value) => {
    if (typeof value === 'boolean') {
        return value;
    }

    return value?.toString()?.toLowerCase() === 'true';
});

export const SwitchField = ({
    name,
    label,
    required = false,
    defaultValue,
    ...props
}: Omit<MuiSwitchProps, 'defaultValue'> & {
    name: string;
    label: string;
    defaultValue?: boolean | string;
}) => {
    const { translate } = useTranslate();
    const { field } = useController({
        name,
        rules: {
            required: required ? translate('error_field_required') : false,
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
