import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import Step from './Step';
import FormSelectField from '../../../lib/components/FormSelectField';
import FieldSchemeInput from '../../../lib/components/FieldSchemeInput';
import FieldLanguageInput from '../../../lib/components/FieldLanguageInput';
import FieldLabelInput from '../../../lib/components/FieldLabelInput';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';

export const StepIdentityComponent = ({
    field,
    p: polyglot,
    ...props
}) => (
    <Step label="field_wizard_step_identity" {...props}>
        <FieldLabelInput />
        <Field
            name="cover"
            component={FormSelectField}
            label={polyglot.t('select_cover')}
            fullWidth
        >
            <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
            <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
        </Field>
        <FieldSchemeInput name="scheme" />
        <FieldLanguageInput field={field} />
    </Step>
);

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepIdentityComponent);
