import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';
import MenuItem from 'material-ui/MenuItem';

import Step from './Step';
import FormSelectField from '../../lib/components/FormSelectField';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldLabelInput from '../FieldLabelInput';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

export const StepIdentityComponent = ({
    field,
    verify,
    p: polyglot,
    ...props
}) => (
    <Step label="field_wizard_step_identity" {...props}>
        <FieldLabelInput />
        <Field
            name="cover"
            component={FormSelectField}
            label={polyglot.t('select_cover')}
            onChange={verify}
            fullWidth
        >
            <MenuItem value="dataset" primaryText={polyglot.t('cover_dataset')} />
            <MenuItem value="collection" primaryText={polyglot.t('cover_collection')} />
        </Field>
        <FieldSchemeInput />
        <FieldLanguageInput field={field} />
    </Step>
);

StepIdentityComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
    verify: React.PropTypes.func.isRequired,
};

export default compose(
    translate,
)(StepIdentityComponent);
