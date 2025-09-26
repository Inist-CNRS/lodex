import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import get from 'lodash/get';

import FormTextField from '../lib/components/FormTextField';
import FieldInput from '../lib/components/FieldInput';
import { fromFields } from '../sharedSelectors';
import { translate } from '../i18n/I18NContext';

// @ts-expect-error TS7006
export const uniqueField = (fields, polyglot) => (value, _, props) => {
    // retrieve previous label of the edited field if any (either in props.field of props.fieldToAdd)
    const label = get(props, 'field.label', get(props, 'fieldToAdd.label'));

    // the value is the same as the label currently edited
    if (label === value) {
        return undefined;
    }

    // check if another field exist with the same label
    // @ts-expect-error TS7031
    return fields.find(({ label }) => label === value)
        ? polyglot.t('field_label_exists')
        : undefined;
};

// @ts-expect-error TS7031
export const FieldLabelInputComponent = ({ disabled }) => (
    <FieldInput
        name="label"
        component={FormTextField}
        labelKey="fieldLabel"
        fullWidth
        disabled={disabled}
    />
);

FieldLabelInputComponent.propTypes = {
    disabled: PropTypes.bool,
};

FieldLabelInputComponent.defaultProps = {
    isNewField: false,
    disabled: false,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    fields: fromFields.getFields(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
    // @ts-expect-error TS2345
)(FieldLabelInputComponent);
