// @ts-expect-error TS6133
import React from 'react';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import { formValueSelector, reduxForm } from 'redux-form';
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
        // @ts-expect-error TS2339
        (s, { match }) => ({
            // @ts-expect-error TS2345
            pathSelected: formValueSelector('SUBRESOURCE_EDIT_FORM')(s, 'path'),
            // @ts-expect-error TS18046
            initialValues: s.subresource.subresources.find(
                // @ts-expect-error TS7006
                (sr) => sr._id === match.params.subresourceId,
            ),
            // @ts-expect-error TS18046
            subresources: s.subresource.subresources,
        }),
        {
            updateSubresource: updateSubresourceAction,
            deleteSubresource: deleteSubresourceAction,
        },
    ),
    branch(
        // @ts-expect-error TS7031
        ({ initialValues }) => !initialValues,
        // @ts-expect-error TS7031
        renderComponent(({ match }) => <Redirect to={`${match.url}/main`} />),
    ),
    withHandlers({
        // @ts-expect-error TS2322
        onSubmit:
            ({ updateSubresource }) =>
            // @ts-expect-error TS7006
            (resource) => {
                updateSubresource(resource);
            },
        // @ts-expect-error TS2322
        onDelete:
            ({ deleteSubresource, match }) =>
            () => {
                deleteSubresource(match.params.subresourceId);
            },
    }),
    // @ts-expect-error TS7031
    withProps(({ onDelete }) => ({
        // @ts-expect-error TS2322
        additionnalActions: <DeleteSubresourceButton onClick={onDelete} />,
    })),
    reduxForm({
        form: 'SUBRESOURCE_EDIT_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
