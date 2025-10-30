import { useMemo } from 'react';

import {
    Checkbox,
    FormControl,
    FormControlLabel,
    FormHelperText,
} from '@mui/material';
import { useField } from '@tanstack/react-form';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface IsContributorNamePublicFieldProps {
    form: object;
}

export function IsContributorNamePublicField({
    form,
}: IsContributorNamePublicFieldProps) {
    const { translate } = useTranslate();
    // @ts-expect-error TS2740
    const field = useField({ name: 'isContributorNamePublic', form });

    // @ts-expect-error TS7006
    const handleCheckboxChange = (event) => {
        field.handleChange(event.target.checked);
    };

    const error = useMemo(() => {
        return field.state.meta.isTouched && field.state.meta.errors?.length
            ? field.state.meta.errors[0]
            : null;
    }, [field.state]);

    return (
        <FormControl>
            <FormControlLabel
                control={
                    <Checkbox
                        // @ts-expect-error TS2322
                        checked={field.state.value ?? false}
                        onChange={handleCheckboxChange}
                    />
                }
                label={translate('annotation.isContributorNamePublic')}
            />
            {error && (
                <FormHelperText error role="alert">
                    {translate(error)}
                </FormHelperText>
            )}
        </FormControl>
    );
}
