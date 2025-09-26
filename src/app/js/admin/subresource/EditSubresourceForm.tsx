import React from 'react';
import { connect } from 'react-redux';
// @ts-expect-error TS7016
import withHandlers from 'recompose/withHandlers';
// @ts-expect-error TS7016
import { formValueSelector, reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';
// @ts-expect-error TS7016
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
        onSubmit:
            // @ts-expect-error TS7031


                ({ updateSubresource }) =>
                // @ts-expect-error TS7006
                (resource) => {
                    updateSubresource(resource);
                },
        onDelete:
            // @ts-expect-error TS7031


                ({ deleteSubresource, match }) =>
                () => {
                    deleteSubresource(match.params.subresourceId);
                },
    }),
    // @ts-expect-error TS7031
    withProps(({ onDelete }) => ({
        additionnalActions: <DeleteSubresourceButton onClick={onDelete} />,
    })),
    reduxForm({
        form: 'SUBRESOURCE_EDIT_FORM',
        enableReinitialize: true,
    }),
)(SubresourceForm);
