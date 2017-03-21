import React, { PropTypes } from 'react';
import classnames from 'classnames';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Dialog from 'material-ui/Dialog';
import ButtonWithStatus from '../lib/ButtonWithStatus';

import { field as fieldPropTypes, polyglot as polyglotPropTypes } from '../propTypes';
import EditFieldForm, { FORM_NAME } from './EditFieldForm';
import { fromResource } from './selectors';
import { isLoggedIn } from '../user';

export const EditFieldComponent = ({
    field,
    handleClose,
    handleOpen,
    handleSubmit,
    handleSave,
    p: polyglot,
    resource,
    isSaving,
    loggedIn,
    isLastVersionSelected,
    show,
    style,
}) => {
    if (!loggedIn || !isLastVersionSelected) {
        return null;
    }
    const actions = [
        <ButtonWithStatus
            className="update-field"
            label={polyglot.t('save')}
            primary
            loading={isSaving}
            onTouchTap={handleSubmit}
        />,
        <FlatButton label={'Cancel'} onClick={handleClose} />,
    ];

    return (
        <div style={style}>
            <IconButton
                className={classnames('edit-field', field.label.toLowerCase().replace(/\s/g, '_'))}
                tooltip={polyglot.t('edit_field', { field: field.label })}
                onClick={handleOpen}
            >
                <EditIcon />
            </IconButton>

            <Dialog
                title={polyglot.t('edit_field', { field: field.label })}
                actions={actions}
                modal={false}
                open={show}
                onRequestClose={handleClose}
            >
                <EditFieldForm
                    field={field}
                    onSaveProperty={handleSave}
                    resource={resource}
                />
            </Dialog>
        </div>
    );
};

EditFieldComponent.propTypes = {
    field: fieldPropTypes.isRequired,
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSave: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    isLastVersionSelected: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    show: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
    loggedIn: isLoggedIn(state),
    isLastVersionSelected: fromResource.isLastVersionSelected(state),
});

const mapDispatchToProps = ({
    submit: submitAction,
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
        handleSubmit: ({ submit }) => () => {
            submit(FORM_NAME);
        },
        handleSave: ({ onSaveProperty, setShow }) => (values) => {
            onSaveProperty(values);
            setShow(false);
        },
    }),
    translate,
)(EditFieldComponent);
