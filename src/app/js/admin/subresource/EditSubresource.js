import React from 'react';
import { connect } from 'react-redux';
import withHandlers from 'recompose/withHandlers';
import { reduxForm } from 'redux-form';
import { Redirect, withRouter } from 'react-router';
import translate from 'redux-polyglot/translate';
import { Add as AddNewIcon } from '@material-ui/icons';

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
import SubresourceExcerpt from './SubresourceExcerpt';
import { fromFields } from '../../sharedSelectors';
import Statistics from '../Statistics';

import {
    updateSubresource as updateSubresourceAction,
    deleteSubresource as deleteSubresourceAction,
} from '.';

import {
    addField as addFieldAction,
    editField as editFieldAction,
} from '../../fields';

const useStyles = makeStyles({
    noFieldZone: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
        textAlign: 'center',
    },
    addFieldButton: {
        marginBottom: 20,
    },
    icon: {
        marginRight: 10,
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
    translate,
    withRouter,
    connect(
        (state, { match }) => ({
            subresource: state.subresource.subresources.find(
                s => s._id === match.params.subresourceId,
            ),
        }),
        { addField: addFieldAction, editField: editFieldAction },
    ),
)(({ addField, editField, subresource, p: polyglot }) => {
    const classes = useStyles();
    return (
        <>
            <Button
                variant="contained"
                color="primary"
                className={classes.addFieldButton}
                onClick={() =>
                    subresource &&
                    addField(createDefaultSubresourceField(subresource))
                }
            >
                <AddNewIcon className={classes.icon} />
                {polyglot.t('new_field')}
            </Button>
            <PublicationModalWizard
                filter="document"
                onExitEdition={() => editField(null)}
            />
        </>
    );
});

const SubresourceFieldTable = compose(
    translate,
    connect(
        (state, { subresourceId }) => ({
            fields: fromFields.getSubresourceFields(state, subresourceId),
        }),
        { editField: editFieldAction },
    ),
)(({ fields, editField, p: polyglot, subresourceId }) => {
    const classes = useStyles();
    console.log(fields);
    if (fields.length <= 1) {
        return (
            <div id="add-subresource-field" className={classes.noFieldZone}>
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
            <div style={{ float: 'right' }}>
                <AddSubresourceFieldButton />
            </div>
            <SubresourceExcerpt onHeaderClick={editField} fields={fields} />
            <Statistics mode="display" filter={subresourceId} />
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
