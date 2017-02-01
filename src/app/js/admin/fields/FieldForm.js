import React from 'react';
import { compose } from 'recompose';
import { connect } from 'react-redux';
import { Card } from 'material-ui/Card';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import { polyglot as polyglotPropTypes } from '../../lib/propTypes';
import FormTextField from '../../lib/FormTextField';
import { FIELD_FORM_NAME, getEditedField, saveField } from './';

import Alert from '../../lib/Alert';

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

export const FieldComponent = ({ error, field, handleSubmit, p: polyglot }) => {
    if (!field) {
        return <span />;
    }

    return (
        <Card>
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
            </form>
        </Card>
    );
};

FieldComponent.defaultProps = {
};

FieldComponent.propTypes = {
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
)(FieldComponent);
