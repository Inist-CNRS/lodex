import { FormControlLabel, Switch as MuiSwitch } from '@mui/material';
import { useController } from 'react-hook-form';

type SwitchProps = {
    name: string;
    label: string;
};

export const Switch = ({ name, label }: SwitchProps) => {
    const { field } = useController({
        name,
    });
    return (
        <FormControlLabel
            control={
                <MuiSwitch
                    checked={field.value ? true : false}
                    onChange={field.onChange}
                />
            }
            label={label}
        />
    );
};
