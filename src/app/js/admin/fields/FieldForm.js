import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, FieldArray, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import FormTextField from '../../lib/FormTextField';
import { FIELD_FORM_NAME, getEditedField, saveField } from './';

import Alert from '../../lib/Alert';
import TransformerList from './TransformerList';

const validate = (values) => {
    const errors = ['username', 'password'].reduce((currentErrors, field) => {
        if (!values[field]) {
            return {
                ...currentErrors,
                [field]: 'Required',
            };
        }
        return currentErrors;
    }, {});

    return errors;
};

export const FieldFormComponent = ({ error, field, handleSubmit, p: polyglot }) => {
    if (!field) {
        return <span />;
    }

    return (
        <form id="login_form" onSubmit={handleSubmit}>
            {error && <Alert><p>{error}</p></Alert>}
            <Field
                name="name"
                component={FormTextField}
                label={polyglot.t('fieldName')}
                fullWidth
            />
            <Field
                name="label"
                component={FormTextField}
                label={polyglot.t('fieldLabel')}
                fullWidth
            />
            <FieldArray name="transformers" component={TransformerList} />
        </form>
    );
};

FieldFormComponent.defaultProps = {
};

FieldFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    initialValues: getEditedField(state),
    field: getEditedField(state),
});

const mapDispatchToProps = {
    handleSubmit: saveField,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: FIELD_FORM_NAME,
        validate,
        enableReinitialize: true,
    }),
    translate,
)(FieldFormComponent);
