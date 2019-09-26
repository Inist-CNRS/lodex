import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import { Button, Dialog } from '@material-ui/core';

import { polyglot as polyglotPropTypes } from '../../propTypes';

export const PureButtonWithDialog = ({
    handleClose,
    handleOpen,
    open,
    show,
    style,
    dialog,
    className,
    label,
    icon,
    p: polyglot,
    actions = [
        <Button key="cancel" onClick={handleClose}>
            {polyglot.t('close')}
        </Button>,
    ],
    openButton = (
        <Button color="primary" className={className} onClick={handleOpen}>
            {icon}
            {label}
        </Button>
    ),
}) => {
    if (!show) {
        return null;
    }

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
                {dialog}
            </Dialog>
        </span>
    );
};

PureButtonWithDialog.propTypes = {
    handleClose: PropTypes.func,
    handleOpen: PropTypes.func,
    p: polyglotPropTypes.isRequired,
    open: PropTypes.bool,
    show: PropTypes.bool,
    style: PropTypes.object,
    dialog: PropTypes.node.isRequired,
    label: PropTypes.string.isRequired,
    icon: PropTypes.node,
    className: PropTypes.string,
    actions: PropTypes.arrayOf(PropTypes.node),
    openButton: PropTypes.node,
};

PureButtonWithDialog.defaultProps = {
    show: true,
    open: false,
    className: null,
};

export default translate(PureButtonWithDialog);
