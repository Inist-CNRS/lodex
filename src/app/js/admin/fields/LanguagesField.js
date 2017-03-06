import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { languages } from '../../../../../config.json';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import FormSelectField from '../../lib/FormSelectField';

export const LanguagesFieldComponent = ({ field, p: polyglot, ...props }) => {
    const languagesItems = languages.map(language => (
        <MenuItem
            className={`language_${field.label.toLowerCase().replace(/\s/g, '_')}`}
            key={language.code}
            value={language.code}
            primaryText={language.label}
        />
    ));

    return (
        <Field
            name="language"
            component={FormSelectField}
            label={polyglot.t('language')}
            fullWidth
            {...props}
        >
            {languagesItems}
        </Field>
    );
};

LanguagesFieldComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(LanguagesFieldComponent);
