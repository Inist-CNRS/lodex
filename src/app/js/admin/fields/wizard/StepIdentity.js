import React from 'react';
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
    p: polyglot,
    ...props
}) => (
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
    </Step>
);

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepIdentityComponent);
