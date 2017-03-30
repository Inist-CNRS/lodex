import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import {
    hideResource as hideResourceAction,
    HIDE_RESOURCE_FORM_NAME,
} from './';

import FormTextField from '../../lib/FormTextField';
import Alert from '../../lib/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';

const validate = (values) => {
    if (!values.reason) {
        return {
            reason: 'Required',
        };
    }

    return {};
};

export const HideResourceFormComponent = ({ resource, resourceError, handleSubmit, p: polyglot }) => (
    <form id="hide_resource_form" onSubmit={() => handleSubmit(resource.uri)}>
        {resourceError && <Alert><p>{resourceError}</p></Alert>}
        <Field
            name="reason"
            component={FormTextField}
            label={polyglot.t('enter_reason')}
            fullWidth
            multiLine
        />
    </form>
);

HideResourceFormComponent.defaultProps = {
    resource: null,
    resourceError: null,
};

HideResourceFormComponent.propTypes = {
    ...reduxFormPropTypes,
    p: polyglotPropTypes.isRequired,
};

const mapStateToProps = state => ({
    resourceError: fromResource.getError(state),
    initialValues: fromResource.getResourceLastVersion(state),
    resource: fromResource.getResourceLastVersion(state),
});

const mapDispatchToProps = {
    hideResource: hideResourceAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        onSubmit: ({ hideResource, resource }) => () => {
            hideResource(resource.uri);
        },
    }),
    reduxForm({
        form: HIDE_RESOURCE_FORM_NAME,
        validate,
    }),
    translate,
)(HideResourceFormComponent);
