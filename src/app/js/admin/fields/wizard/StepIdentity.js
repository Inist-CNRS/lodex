import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import Step from './Step';
import FormTextField from '../../../lib/FormTextField';
import FormSelectField from '../../../lib/FormSelectField';
import SchemeAutoComplete from '../../../lib/SchemeAutoComplete';
import LanguagesField from '../LanguagesField';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';

export const StepIdentityComponent = ({
    field,
    fields,
    p: polyglot,
    ...props
}) => {
    const otherFieldsMenuItems = fields.map(f => (
        <MenuItem
            className={`completes_${f.label.toLowerCase().replace(/\s/g, '_')}`}
            key={f.name}
            value={f.name}
            primaryText={f.label}
        />
    ));

    return (
        <Step label="field_wizard_step_identity" {...props}>
            <Field
                name="label"
                component={FormTextField}
                label={polyglot.t('fieldLabel')}
                fullWidth
            />
            <Field
                name="cover"
                component={FormSelectField}
                label={polyglot.t('select_cover')}
                fullWidth
            >
                <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
                <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
            </Field>
            <SchemeAutoComplete name="scheme" />
            <LanguagesField field={field} />
            <Field
                className="completes"
                name="completes"
                component={FormSelectField}
                label={polyglot.t('completes_field')}
                fullWidth
            >
                <MenuItem primaryText={polyglot.t('completes_field_none')} />
                {otherFieldsMenuItems}
            </Field>
        </Step>
    );
};

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepIdentityComponent);
