import React from 'react';
import { connect } from 'react-redux';
import { compose, branch, renderComponent } from 'recompose';
import withHandlers from 'recompose/withHandlers';
import { reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';

import { updateSubresource as updateSubresourceAction } from '.';
import SubresourceForm from './SubresourceForm';

export const EditSubresource = compose(
    withRouter,
    connect(
        (s, { match }) => ({
            initialValues: s.subresource.subresources.find(
                sr => sr._id === match.params.resourceId,
            ),
        }),
        { updateSubresource: updateSubresourceAction },
    ),
    branch(
        ({ initialValues }) => !initialValues,
        renderComponent(({ match }) => <Redirect to={`${match.url}/main`} />),
    ),
    withHandlers({
        onSubmit: ({ updateSubresource }) => resource => {
            updateSubresource(resource);
        },
    }),
    reduxForm({
        form: 'SUBRESOURCE_EDIT_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
