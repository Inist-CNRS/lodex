import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import Step from './Step';
import FormCheckboxField from '../../../lib/FormCheckboxField';
import PositionField from '../PositionField';
import Format from '../../FormatEdition';
import { polyglot as polyglotPropTypes, field as fieldPropTypes } from '../../../propTypes';

export const StepDisplayComponent = ({
    field,
    p: polyglot,
    ...props
}) => (
    <Step label="field_wizard_step_display" {...props}>
        <Field
            name="display_in_list"
            component={FormCheckboxField}
            label={polyglot.t('field_display_in_list')}
        />
        <Field
            name="display_in_resource"
            component={FormCheckboxField}
            label={polyglot.t('field_display_in_resource')}
        />
        <PositionField field={field} />
        <Field
            name="format"
            component={Format}
            label={polyglot.t('format')}
            fullWidth
        />
    </Step>
);

StepDisplayComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepDisplayComponent);
