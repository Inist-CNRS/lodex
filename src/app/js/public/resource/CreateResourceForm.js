import React from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import { createResource, CREATE_RESOURCE_FORM_NAME } from './';
import Alert from '../../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';
import { fromFields } from '../../sharedSelectors';
import FieldInput from '../../fields/editFieldValue/FieldInput';
import UriFieldInput from '../../lib/components/UriFieldInput';

export const validate = (values, { p: polyglot }) => {
    const errors = Object.keys(values).reduce((currentErrors, field) => {
        if (field === 'uri') {
            const uri = values[field];
            if (
                !uri ||
                uri.startsWith('uid:/') ||
                uri.startsWith('ark:/') ||
                uri.startsWith('http://')
            ) {
                return currentErrors;
            }
            return {
                ...currentErrors,
                [field]: polyglot.t('invalid_uri'),
            };
        }

        return currentErrors;
    }, {});

    return errors;
};

export const CreateResourceFormComponent = ({
    fields,
    error,
    handleSubmit,
    p: polyglot,
}) => (
    <form id="resource_form" onSubmit={handleSubmit}>
        {error && (
            <Alert>
                <p>{polyglot.t(error)}</p>
            </Alert>
        )}
        <UriFieldInput />
        {fields
            .filter(({ name }) => name !== 'uri')
            .map(field => <FieldInput key={field.name} field={field} />)}
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

const mapStateToProps = state => {
    const fields = fromFields.getCollectionFieldsExceptComposite(state);
    return {
        fields,
        error: fromResource.getError(state),
        initialValues: fields.reduce(
            (acc, { name }) => ({
                ...acc,
                [name]: null,
            }),
            {},
        ),
    };
};

const mapDispatchToProps = {
    onSubmit: createResource,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: CREATE_RESOURCE_FORM_NAME,
        validate,
    }),
)(CreateResourceFormComponent);
