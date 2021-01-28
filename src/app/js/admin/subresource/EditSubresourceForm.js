import React from 'react';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import { reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';
import { compose, branch, renderComponent, withProps } from 'recompose';

import SubresourceForm from './SubresourceForm';
import { DeleteSubresourceButton } from './DeleteSubresourceButton';

import {
    updateSubresource as updateSubresourceAction,
    deleteSubresource as deleteSubresourceAction,
} from '.';

export const EditSubresourceForm = compose(
    withRouter,
    connect(
        (s, { match }) => ({
            initialValues: s.subresource.subresources.find(
                sr => sr._id === match.params.subresourceId,
            ),
        }),
        {
            updateSubresource: updateSubresourceAction,
            deleteSubresource: deleteSubresourceAction,
        },
    ),
    branch(
        ({ initialValues }) => !initialValues,
        renderComponent(({ match }) => <Redirect to={`${match.url}/main`} />),
    ),
    withHandlers({
        onSubmit: ({ updateSubresource }) => resource => {
            updateSubresource(resource);
        },
        onDelete: ({ deleteSubresource, match }) => () => {
            deleteSubresource(match.params.subresourceId);
        },
    }),
    withProps(({ onDelete }) => ({
        additionnalActions: <DeleteSubresourceButton onClick={onDelete} />,
    })),
    reduxForm({
        form: 'SUBRESOURCE_EDIT_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
