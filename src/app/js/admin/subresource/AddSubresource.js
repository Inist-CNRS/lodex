import { connect } from 'react-redux';
import { compose } from 'recompose';
import withHandlers from 'recompose/withHandlers';
import { withRouter } from 'react-router';
import { reduxForm } from 'redux-form';

import { createSubresource as createSubresourceAction } from '.';
import SubresourceForm from './SubresourceForm';

export const AddSubresource = compose(
    withRouter,
    connect(null, { createSubresource: createSubresourceAction }),
    withHandlers({
        onSubmit: ({ createSubresource, history }) => resource => {
            createSubresource({
                resource,
                callback: id => history.push(`/display/document/${id}`),
            });
        },
    }),
    reduxForm({
        form: 'SUBRESOURCE_ADD_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
