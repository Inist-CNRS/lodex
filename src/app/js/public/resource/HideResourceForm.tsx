import React from 'react';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { connect } from 'react-redux';
import { translate } from '../../i18n/I18NContext';
// @ts-expect-error TS7016
import { Field, reduxForm, propTypes as reduxFormPropTypes } from 'redux-form';

import {
    hideResource as hideResourceAction,
    HIDE_RESOURCE_FORM_NAME,
} from './';

import FormTextField from '../../lib/components/FormTextField';
import Alert from '../../lib/components/Alert';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromResource } from '../selectors';

// @ts-expect-error TS7006
const validate = (values, { p: polyglot }) => {
    if (!values.reason) {
        return {
            reason: polyglot.t('required'),
        };
    }

    return {};
};

export const HideResourceFormComponent = ({
    // @ts-expect-error TS7031
    resource,
    // @ts-expect-error TS7031
    resourceError,
    // @ts-expect-error TS7031
    handleSubmit,
    // @ts-expect-error TS7031
    p: polyglot,
}) => (
    <form id="hide_resource_form" onSubmit={() => handleSubmit(resource.uri)}>
        {resourceError && (
            <Alert>
                <p>{resourceError}</p>
            </Alert>
        )}
        <Field
            name="reason"
            component={FormTextField}
            label={polyglot.t('enter_reason')}
            fullWidth
            multiline
            variant="standard"
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    resourceError: fromResource.getError(state),
    // @ts-expect-error TS2339
    initialValues: fromResource.getResourceLastVersion(state),
    // @ts-expect-error TS2339
    resource: fromResource.getResourceLastVersion(state),
});

const mapDispatchToProps = {
    hideResource: hideResourceAction,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
    withHandlers({
        // @ts-expect-error TS2322
        onSubmit:
            ({ hideResource, resource }) =>
            () => {
                hideResource(resource.uri);
            },
    }),
    reduxForm({
        form: HIDE_RESOURCE_FORM_NAME,
        validate,
    }),
    // @ts-expect-error TS2345
)(HideResourceFormComponent);
