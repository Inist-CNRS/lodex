import React from 'react';
import { connect } from 'react-redux';
import { compose, branch, renderComponent, withProps } from 'recompose';
import withHandlers from 'recompose/withHandlers';
import { reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';
import { Button } from '@material-ui/core';
import translate from 'redux-polyglot/translate';
import { Add as ContentAdd } from '@material-ui/icons';

import PublicationModalWizard from '../../fields/wizard';
import SubresourceForm from './SubresourceForm';
import FloatingActionButton from '../../lib/components/FloatingActionButton';

import {
    updateSubresource as updateSubresourceAction,
    deleteSubresource as deleteSubresourceAction,
} from '.';

import {
    addField as addFieldAction,
    editField as editFieldAction,
} from '../../fields';

import SubresourceExcerpt from './SubresourceExcerpt';
import { fromFields } from '../../sharedSelectors';

const DeleteSubresourceButton = translate(({ p: polyglot, onClick }) => (
    <Button
        variant="contained"
        color="secondary"
        onClick={() => {
            if (confirm(polyglot.t('confirm_delete_subresource'))) {
                onClick();
            }
        }}
    >
        {polyglot.t('delete')}
    </Button>
));

const EditSubresourceForm = compose(
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

const createDefaultSubresourceField = subresourceId => ({
    subresourceId,
    transformers: [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: 'most_found_animal_species',
                },
            ],
        },
        { operation: 'PARSE' },
        {
            operation: 'GET',
            args: [{ name: 'path', type: 'string', value: '' }],
        },
    ],
});

const AddSubresourceFieldButton = compose(
    withRouter,
    connect(null, { addField: addFieldAction, editField: editFieldAction }),
)(({ addField, editField, match }) => (
    <>
        <FloatingActionButton
            onClick={() =>
                addField(
                    createDefaultSubresourceField(match.params.subresourceId),
                )
            }
        >
            <ContentAdd />
        </FloatingActionButton>
        <PublicationModalWizard
            filter="document"
            onExitEdition={() => editField(null)}
        />
    </>
));

const SubresourceFieldTable = compose(
    translate,
    connect(
        (state, { subresourceId }) => ({
            fields: fromFields.getSubresourceFields(state, subresourceId),
        }),
        { editField: editFieldAction },
    ),
)(({ fields, editField, p: polyglot }) => {
    if (!fields.length) {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginTop: '100px',
                    textAlign: 'center',
                }}
            >
                <div>
                    <h2 style={{ color: '#888' }}>
                        {polyglot.t('no_field_for_subresource')}
                    </h2>
                    <div>
                        <AddSubresourceFieldButton />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ margin: '50px 0' }}>
            <SubresourceExcerpt onHeaderClick={editField} fields={fields} />
            <div style={{ float: 'right' }}>
                <AddSubresourceFieldButton />
            </div>
        </div>
    );
});

export const EditSubresource = withRouter(({ match }) => {
    const subresourceId = match.params.subresourceId;

    return (
        <>
            <EditSubresourceForm />
            <SubresourceFieldTable subresourceId={subresourceId} />
        </>
    );
});
