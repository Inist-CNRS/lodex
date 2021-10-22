import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import Step from './Step';
import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInput from '../FieldDisplay';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '../';
import { fromFields } from '../../sharedSelectors';
import FieldWidthInput from '../FieldWidthInput';
import { SCOPES } from '../../../../common/scope';

export const StepDisplayComponent = ({
    scope,
    keepMeta = true,
    isSubresourceField = false,
    p: polyglot,
    ...props
}) => (
    <Step id="step-display" label="field_wizard_step_display" {...props}>
        {keepMeta && <FieldDisplayInput />}
        {keepMeta && (
            <FieldOverviewInput isSubresourceField={isSubresourceField} />
        )}
        <FieldFormatInput />
        <FieldWidthInput />
    </Step>
);

StepDisplayComponent.propTypes = {
    transformers: PropTypes.arrayOf(PropTypes.object).isRequired,
    scope: PropTypes.oneOf(SCOPES),
    format: PropTypes.object,
    p: polyglotPropTypes.isRequired,
    keepMeta: PropTypes.bool,
    isSubresourceField: PropTypes.bool,
};

const mapStateToProps = state => {
    const values = getFormValues(FIELD_FORM_NAME)(state);

    return {
        fields: fromFields.getFields(state),
        format: values && values.format,
        transformers: values && values.transformers ? values.transformers : [],
        scope: values && values.scope,
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(StepDisplayComponent);
