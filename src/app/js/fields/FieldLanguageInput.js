import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import { MenuItem } from '@material-ui/core';

import languages from '../../../common/languages';
import FormSelectField from '../lib/components/FormSelectField';
import getFieldClassName from '../lib/getFieldClassName';

import {
    field as fieldPropTypes,
    polyglot as polyglotPropTypes,
} from '../propTypes';

export const FieldLanguageInputComponent = ({
    field,
    p: polyglot,
    ...props
}) => {
    const languagesItems = languages.map(language => (
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
            {...props}
        >
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
