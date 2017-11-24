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
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromFields } from '../../sharedSelectors';
import FormTextField from '../../lib/components/FormTextField';
import FieldSchemeInput from '../../fields/FieldSchemeInput';
import FieldFormatInput from '../../fields/FieldFormatInput';

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

export const AddFieldFormComponent = ({
    addCharacteristicError,
    onSubmit,
    p: polyglot,
}) => (
    <form id="add_characteristic_form" onSubmit={onSubmit}>
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
    </form>
);

AddFieldFormComponent.defaultProps = {
    error: null,
    saving: false,
};

AddFieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    addCharacteristicError: fromFields.getError(state),
    saving: fromFields.isSaving(state),
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
)(AddFieldFormComponent);
