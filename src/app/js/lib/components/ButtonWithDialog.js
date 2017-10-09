import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import compose from 'recompose/compose';
import withHandlers from 'recompose/withHandlers';
import { submit as submitAction } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import Dialog from 'material-ui/Dialog';
import IconButton from 'material-ui/IconButton';
import classnames from 'classnames';
import CircularProgress from 'material-ui/CircularProgress';

import ButtonWithStatus from './ButtonWithStatus';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export const ButtonWithDialogComponent = ({
    buttonStyle,
    handleClose,
    handleOpen,
    handleSubmit,
    saving,
    open,
    show,
    style,
    icon,
    form,
    className,
    label,
    p: polyglot,
}) => {
    if (!show) {
        return null;
    }
    const actions = [
        <ButtonWithStatus
            className={classnames(className, 'save')}
            label={polyglot.t('save')}
            primary
            loading={saving}
            onTouchTap={handleSubmit}
        />,
        <FlatButton label={polyglot.t('cancel')} onClick={handleClose} />,
    ];

    const openButton = icon ? (
        <IconButton
            className={classnames('open', className)}
            tooltip={label}
            onClick={handleOpen}
            style={buttonStyle}
        >
            {saving ? <CircularProgress /> : icon}
        </IconButton>
    ) : (
        <FlatButton
            className={className}
            label={label}
            primary
            onClick={handleOpen}
            style={buttonStyle}
        />
    );

    return (
        <span style={style}>
            {openButton}
            <Dialog
                title={label}
                actions={actions}
                modal={false}
                open={open}
                onRequestClose={handleClose}
                autoScrollBodyContent
            >
                {form}
            </Dialog>
        </span>
    );
};

ButtonWithDialogComponent.defaultProps = {
    icon: null,
    show: true,
    open: false,
};

ButtonWithDialogComponent.propTypes = {
    handleClose: PropTypes.func.isRequired,
    handleOpen: PropTypes.func.isRequired,
    handleSubmit: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    saving: PropTypes.bool.isRequired,
    open: PropTypes.bool,
    show: PropTypes.bool,
    buttonStyle: PropTypes.object, // eslint-disable-line
    style: PropTypes.object, // eslint-disable-line
    form: PropTypes.node.isRequired,
    icon: PropTypes.node,
    label: PropTypes.string.isRequired,
    className: PropTypes.string.isRequired,
};

const mapDispatchToProps = ({ submit: submitAction });

export default compose(
    connect(null, mapDispatchToProps),
    withHandlers({
        handleSubmit: ({ submit, formName }) => () => {
            submit(formName);
        },
    }),
    translate,
)(ButtonWithDialogComponent);
