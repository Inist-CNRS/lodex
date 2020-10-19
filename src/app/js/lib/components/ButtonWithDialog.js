import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@material-ui/core';

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
        <Button variant="text" key="cancel" onClick={handleClose}>
            {polyglot.t('close')}
        </Button>,
    ],
    openButton = (
        <Button
            variant="text"
            color="primary"
            className={className}
            startIcon={icon}
            onClick={handleOpen}
        >
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
            <Dialog open={open} onClose={handleClose} scroll="body">
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>
                    <div className="dialog-body">
                        <div className="dialog-content">{dialog}</div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <div className="dialog-actions">{actions}</div>
                </DialogActions>
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
    label: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
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
