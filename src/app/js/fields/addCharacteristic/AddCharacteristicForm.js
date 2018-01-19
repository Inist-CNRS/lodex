import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, Field, propTypes as reduxFormPropTypes } from 'redux-form';

import {
    addCharacteristic as addCharacteristicAction,
    NEW_CHARACTERISTIC_FORM_NAME,
} from '../';
import Alert from '../../lib/components/Alert';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
} from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import FormTextField from '../../lib/components/FormTextField';
import FieldSchemeInput from '../../fields/FieldSchemeInput';
import FieldFormatInput from '../../fields/FieldFormatInput';
import FieldWidthInput from '../../fields/FieldWidthInput';
import FieldCompletes from '../../fields/FieldCompletes';
import FieldComposedOf from '../../fields/FieldComposedOf';
import InvalidFieldProperties from '../InvalidFieldProperties';

const validate = (values, { p: polyglot }) => {
    const errors = ['label', 'value'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: polyglot.t('required'),
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export const AddCharacteristicFormComponent = ({
    fields,
    addCharacteristicError,
    onSubmit,
    p: polyglot,
}) => (
    <form id="add_characteristic_form" onSubmit={onSubmit}>
        <InvalidFieldProperties />
        {addCharacteristicError && (
            <Alert>
                <p>{addCharacteristicError}</p>
            </Alert>
        )}
        <Field
            name="label"
            fullWidth
            component={FormTextField}
            label={polyglot.t('label')}
        />
        <Field
            name="value"
            fullWidth
            component={FormTextField}
            label={polyglot.t('value')}
        />
        <FieldSchemeInput name="scheme" />
        <FieldFormatInput name="format" />
        <FieldWidthInput name="width" />
        <FieldCompletes fields={fields} />
        <FieldComposedOf
            fields={fields}
            FORM_NAME={NEW_CHARACTERISTIC_FORM_NAME}
        />
    </form>
);

AddCharacteristicFormComponent.defaultProps = {
    error: null,
    saving: false,
};

AddCharacteristicFormComponent.propTypes = {
    ...reduxFormPropTypes,
    saving: PropTypes.bool,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    addCharacteristicError: fromFields.getError(state),
    saving: fromFields.isSaving(state),
    fields: fromFields.getDatasetFields(state),
});

const mapDispatchToProps = {
    addCharacteristic: addCharacteristicAction,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ addCharacteristic }) => () => {
            addCharacteristic();
        },
    }),
    reduxForm({
        form: NEW_CHARACTERISTIC_FORM_NAME,
        validate,
    }),
)(AddCharacteristicFormComponent);
