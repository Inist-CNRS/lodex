import React from 'react';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import { languages } from '../../../../../config.json';
import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../../propTypes';
import FormSelectField from './FormSelectField';
import getFieldClassName from '../getFieldClassName';

export const FieldLanguageInputComponent = ({ field, p: polyglot, ...props }) => {
    const languagesItems = languages.map(language => (
        <MenuItem
            className={`language_${getFieldClassName(field)}`}
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
            <MenuItem
                className={`language_${getFieldClassName(field)}`}
                key={null}
                value={null}
                primaryText={polyglot.t('none')}
            />
            {languagesItems}
        </Field>
    );
};

FieldLanguageInputComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FieldLanguageInputComponent);
