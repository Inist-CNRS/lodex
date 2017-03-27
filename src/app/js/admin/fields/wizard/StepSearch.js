import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { Field } from 'redux-form';

import Step from './Step';
import FormCheckboxField from '../../../lib/FormCheckboxField';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

export const StepSearchComponent = ({ p: polyglot, ...props }) => (
    <Step label="field_wizard_step_search" {...props}>
        <Field
            name="searchable"
            component={FormCheckboxField}
            label={polyglot.t('field_searchable')}
        />
        <Field
            name="isFacet"
            component={FormCheckboxField}
            label={polyglot.t('field_is_facet')}
        />
    </Step>
);

StepSearchComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
};

export default compose(
    translate,
)(StepSearchComponent);
