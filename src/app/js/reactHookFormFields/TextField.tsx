import {
    TextField as MuiTextField,
    type TextFieldProps as MuiTextFieldProps,
} from '@mui/material';
import { useController } from 'react-hook-form';

export const TextField = ({
    name,
    validate,
    label,
    ...props
}: MuiTextFieldProps & {
    name: string;
    validate?: (value: unknown) => string | undefined;
    label: string;
}) => {
    const { field, fieldState } = useController({
        name,
        rules: {
            validate,
        },
    });

    return (
        <MuiTextField
            {...props}
            placeholder={`${label} *`}
            label={`${label} *`}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            value={field.value ?? ''}
            onChange={(e) => field.onChange(e.target.value)}
        />
    );
};
