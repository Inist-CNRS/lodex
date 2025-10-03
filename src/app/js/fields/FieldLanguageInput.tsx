// @ts-expect-error TS6133
import React from 'react';
import { Field } from 'redux-form';
import { MenuItem } from '@mui/material';

import languages from '../../../common/languages';
import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';
import { translate } from '../i18n/I18NContext';

export const FieldLanguageInputComponent = ({
    // @ts-expect-error TS7031
    field,
    // @ts-expect-error TS7031
    p: polyglot,
    ...props
}) => {
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
        <Field
            name="language"
            component={FormSelectField}
            label={polyglot.t('language')}
            fullWidth
            sx={{
                marginTop: 3,
            }}
            {...props}
        >
            {/*
             // @ts-expect-error TS2769 */}
            <MenuItem
                className={`language_${getFieldClassName(field)}`}
                key={null}
                value={null}
            >
                {polyglot.t('none')}
            </MenuItem>
            {languagesItems}
        </Field>
    );
};

FieldLanguageInputComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldLanguageInputComponent);
