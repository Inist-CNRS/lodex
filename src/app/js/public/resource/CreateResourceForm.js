import React, { PropTypes } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import {
    createResource,
    CREATE_RESOURCE_FORM_NAME,
} from './';
import Alert from '../../lib/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromPublication } from '../selectors';
import FieldInput from '../FieldInput';

const validate = (values) => {
    const errors = Object.keys(values).reduce((currentErrors, field) => {
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

export const CreateResourceFormComponent = ({ fields, error, handleSubmit }) => (
    <form id="resource_form" onSubmit={handleSubmit}>
        {error && <Alert><p>{error}</p></Alert>}
        {fields.filter(({ name }) => name !== 'uri').map(field => (
            <FieldInput key={field.name} field={field} />
        ))}
    </form>
);

CreateResourceFormComponent.defaultProps = {
    resource: null,
    error: null,
    saving: false,
};

CreateResourceFormComponent.propTypes = {
    ...reduxFormPropTypes,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
    saving: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    fields: fromPublication.getCollectionFieldsExceptComposite(state),
});

const mapDispatchToProps = {
    onSubmit: createResource,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: CREATE_RESOURCE_FORM_NAME,
        validate,
    }),
    translate,
)(CreateResourceFormComponent);
