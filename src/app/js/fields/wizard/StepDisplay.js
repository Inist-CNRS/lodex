import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';

import Step from './Step';
import FieldFormatInput from '../FieldFormatInput';
import FieldOverviewInput from '../FieldOverviewInput';
import FieldDisplayInResourceInput from '../FieldDisplayInResourceInput';
import FieldDisplayInGraphInput from '../FieldDisplayInGraphInput';
import FieldDisplayInHomeInput from '../FieldDisplayInHomeInput';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { FIELD_FORM_NAME } from '../';
import { fromFields } from '../../sharedSelectors';
import FieldWidthInput from '../FieldWidthInput';
import { SCOPES, SCOPE_DATASET } from '../../../../common/scope';

export const StepDisplayComponent = ({
    cover,
    keepMeta = true,
    p: polyglot,
    ...props
}) => (
    <Step id="step-display" label="field_wizard_step_display" {...props}>
        {keepMeta && <FieldDisplayInResourceInput />}
        {keepMeta && cover === SCOPE_DATASET && <FieldDisplayInGraphInput />}
        {keepMeta && cover === SCOPE_DATASET && <FieldDisplayInHomeInput />}
        {keepMeta && <FieldOverviewInput />}
        <FieldFormatInput />
        <FieldWidthInput />
    </Step>
);

StepDisplayComponent.propTypes = {
    transformers: PropTypes.arrayOf(PropTypes.object).isRequired,
    cover: PropTypes.oneOf(SCOPES),
    format: PropTypes.object,
    p: polyglotPropTypes.isRequired,
    keepMeta: PropTypes.bool,
};

const mapStateToProps = state => {
    const values = getFormValues(FIELD_FORM_NAME)(state);

    return {
        fields: fromFields.getFields(state),
        format: values && values.format,
        transformers: values && values.transformers ? values.transformers : [],
        cover: values && values.cover,
    };
};

export default compose(
    connect(mapStateToProps),
    translate,
)(StepDisplayComponent);
