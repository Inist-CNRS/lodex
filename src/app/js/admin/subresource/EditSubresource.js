import React from 'react';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import { reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';
import translate from 'redux-polyglot/translate';
import { Add as ContentAdd } from '@material-ui/icons';

import {
    compose,
    branch,
    renderComponent,
    withProps,
    withState,
} from 'recompose';

import {
    Button,
    makeStyles,
    Dialog,
    DialogTitle,
    DialogContent,
} from '@material-ui/core';

import PublicationModalWizard from '../../fields/wizard';
import SubresourceForm from './SubresourceForm';
import FloatingActionButton from '../../lib/components/FloatingActionButton';
import SubresourceExcerpt from './SubresourceExcerpt';
import { fromFields } from '../../sharedSelectors';

import {
    updateSubresource as updateSubresourceAction,
    deleteSubresource as deleteSubresourceAction,
} from '.';

import {
    addField as addFieldAction,
    editField as editFieldAction,
} from '../../fields';

const useStyles = makeStyles({
    addFieldButton: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '100px',
        textAlign: 'center',
    },
});

const DeleteSubresourceButton = compose(
    translate,
    withState('showDeletePopup', 'setShowDeletePopup', false),
)(({ p: polyglot, onClick, showDeletePopup, setShowDeletePopup }) => (
    <>
        <Button
            variant="contained"
            color="secondary"
            onClick={() => setShowDeletePopup(true)}
        >
            {polyglot.t('delete')}
        </Button>
        {showDeletePopup && (
            <Dialog open>
                <DialogTitle>
                    {polyglot.t('confirm_delete_subresource')}
                </DialogTitle>
                <DialogContent>
                    <Button
                        variant="contained"
                        color="secondary"
                        onClick={onClick}
                    >
                        OK
                    </Button>
                </DialogContent>
            </Dialog>
        )}
    </>
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

const createDefaultSubresourceField = subresource => ({
    subresourceId: subresource._id,
    transformers: [
        {
            operation: 'COLUMN',
            args: [
                {
                    name: 'column',
                    type: 'column',
                    value: subresource.path,
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
    connect(
        (state, { match }) => ({
            subresource: state.subresource.subresources.find(
                s => s._id === match.params.subresourceId,
            ),
        }),
        { addField: addFieldAction, editField: editFieldAction },
    ),
)(({ addField, editField, subresource }) => (
    <>
        <FloatingActionButton
            onClick={() =>
                subresource &&
                addField(createDefaultSubresourceField(subresource))
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
    const classes = useStyles();

    if (!fields.length) {
        return (
            <div id="add-subresource-field" className={classes.addFieldButton}>
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
