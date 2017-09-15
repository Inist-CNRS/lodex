import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { FieldArray } from 'redux-form';
import Step from './Step';
import FieldSchemeInput from '../FieldSchemeInput';
import FieldLanguageInput from '../FieldLanguageInput';
import FieldLabelInput from '../FieldLabelInput';
import FieldCoverInput from '../../fields/FieldCoverInput';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../propTypes';

import ClassList from '../ClassList';

export const StepIdentityComponent = ({
    field,
    p: polyglot,
    ...props
}) => (
    <Step label="field_wizard_step_identity" {...props}>
        <FieldLabelInput />
        <FieldCoverInput />
        <FieldSchemeInput />
        <FieldArray name="classes" component={ClassList} type="classes" />
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
