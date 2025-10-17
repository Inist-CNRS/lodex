import { MenuItem } from '@mui/material';

import { languages } from '@lodex/common';
import getFieldClassName from '../lib/getFieldClassName';
import { useTranslate } from '../i18n/I18NContext';
import { TextField } from '../reactHookFormFields/TextField.tsx';
import type { ComponentProps } from 'react';
import type { Field } from './types.ts';

export const FieldLanguageInputComponent = ({
    field,
    ...props
}: Partial<ComponentProps<typeof TextField>> & {
    field: Field;
}) => {
    const { translate } = useTranslate();

    const languagesItems = languages.map((language) => (
        <MenuItem
            className={`language_${getFieldClassName(field)}`}
            key={language.code}
            value={language.code}
        >
            {language.label}
        </MenuItem>
    ));

    return (
        <TextField
            {...props}
            select
            name="language"
            label={translate('language')}
            fullWidth
            sx={{
                marginTop: 3,
            }}
        >
            {/* @ts-expect-error TS2769 */}
            <MenuItem
                className={`language_${getFieldClassName(field)}`}
                key={null}
                value={null}
            >
                {translate('none')}
            </MenuItem>
            {languagesItems}
        </TextField>
    );
};

export default FieldLanguageInputComponent;
