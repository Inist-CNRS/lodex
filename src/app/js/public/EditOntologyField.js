import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import ButtonWithStatus from '../lib/ButtonWithStatus';
import getFieldClassName from '../lib/getFieldClassName';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';
import EditOntologyFieldForm from './EditOntologyFieldForm';
import { isLoggedIn } from '../user';
import { saveField } from './publication';
import { fromPublication } from './selectors';

const styles = {
    container: {
        marginLeft: 'auto',
    },
};

export const EditOntologyFieldComponent = ({
    field,
    handleClose,
    handleOpen,
    handleSave,
    p: polyglot,
    isSaving,
    loggedIn,
    show,
}) => {
    if (!loggedIn) {
        return null;
    }
    const actions = [
        <ButtonWithStatus
            className="update-field"
            label={polyglot.t('save')}
            primary
            loading={isSaving}
            onTouchTap={handleSave}
        />,
        <FlatButton label={'Cancel'} onClick={handleClose} />,
    ];

    return (
        <div style={styles.container}>
            <IconButton
                className={classnames('edit-field', getFieldClassName(field))}
                tooltip={polyglot.t('edit_field', { field: field.label })}
                onClick={handleOpen}
            >
                <SettingsIcon />
            </IconButton>

            <Dialog
                title={polyglot.t('edit_ontology_field', { field: field.label })}
                actions={actions}
                modal={false}
                open={show}
                onRequestClose={handleClose}
            >
                <EditOntologyFieldForm
                    field={field}
                    onSaveField={handleSave}
                />
            </Dialog>
        </div>
    );
};

EditOntologyFieldComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    show: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state),
    isSaving: fromPublication.isPublicationSaving(state),
});

const mapDispatchToProps = ({
    submit: submitAction,
    onSaveField: saveField,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withState('show', 'setShow', false),
    withHandlers({
        handleOpen: ({ setShow }) => (event) => {
            event.preventDefault();
            setShow(true);
        },
        handleClose: ({ setShow }) => (event) => {
            event.preventDefault();
            setShow(false);
        },
        handleSave: ({ onSaveField, setShow }) => (values) => {
            onSaveField(values);
            setShow(false);
        },
    }),
    translate,
)(EditOntologyFieldComponent);
