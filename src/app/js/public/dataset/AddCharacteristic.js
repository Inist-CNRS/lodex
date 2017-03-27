import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withState from 'recompose/withState';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';

import ButtonWithStatus from '../../lib/ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromCharacteristic } from '../selectors';
import AddCharacteristicForm from './AddCharacteristicForm';
import {
    NEW_CHARACTERISTIC_FORM_NAME,
} from './';

export const AddCharacteristicComponent = ({
    handleClose,
    handleOpen,
    handleSubmit,
    saving,
    show,
    style,
    p: polyglot,
}) => {
    const actions = [
        <ButtonWithStatus
            className="add-field-to-resource"
            label={polyglot.t('add_characteristic')}
            primary
            loading={saving}
            onTouchTap={handleSubmit}
        />,
        <FlatButton label={polyglot.t('cancel')} onClick={handleClose} />,
    ];

    return (
        <div style={style}>
            <FlatButton
                className="add-characteristic"
                label={polyglot.t('add_characteristic')}
                primary
                onClick={handleOpen}
            />

            <Dialog
                title={polyglot.t('add_characteristic')}
                actions={actions}
                modal={false}
                open={show}
                onRequestClose={handleClose}
            >
                <AddCharacteristicForm />
            </Dialog>
        </div>
    );
};

AddCharacteristicComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
    saving: fromCharacteristic.isSaving(state),
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
        handleSubmit: ({ setShow, submit }) => () => {
            submit(NEW_CHARACTERISTIC_FORM_NAME);
            setShow(false);
        },
    }),
    translate,
)(AddCharacteristicComponent);
