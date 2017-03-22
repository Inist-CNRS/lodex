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
import { fromResource } from '../selectors';
import { HIDE_RESOURCE_FORM_NAME } from './';
import HideResourceForm from './HideResourceForm';
import { isLoggedIn } from '../../user';

export const HideResourceComponent = ({
    handleClose,
    handleOpen,
    handleSubmit,
    saving,
    show,
    loggedIn,
    style,
    p: polyglot,
}) => {
    if (!loggedIn) {
        return null;
    }
    const actions = [
        <ButtonWithStatus
            className="hide-resource"
            label={polyglot.t('hide')}
            primary
            loading={saving}
            onTouchTap={handleSubmit}
        />,
        <FlatButton label={'Cancel'} onClick={handleClose} />,
    ];

    return (
        <div style={style}>
            <FlatButton
                id="btn-hide-resource"
                label={polyglot.t('hide')}
                primary
                onClick={handleOpen}
            />

            <Dialog
                title={polyglot.t('remove_resource')}
                actions={actions}
                modal={false}
                open={show}
                onRequestClose={handleClose}
            >
                <HideResourceForm />
            </Dialog>
        </div>
    );
};

HideResourceComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    loggedIn: PropTypes.bool.isRequired,
    show: PropTypes.bool.isRequired,
    style: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = state => ({
    saving: fromResource.isSaving(state),
    loggedIn: isLoggedIn(state),
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
            submit(HIDE_RESOURCE_FORM_NAME);
        },
    }),
    translate,
)(HideResourceComponent);
