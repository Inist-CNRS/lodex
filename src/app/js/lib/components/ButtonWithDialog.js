import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import { polyglot as polyglotPropTypes } from '../../propTypes';

const styles = {
    modal: {
        transform: 'translate(0px, 8px)',
    },
};

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
        <Button primary className={className} onClick={handleOpen}>
            {label}
            {icon}
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
                modal={false}
                open={open}
                onRequestClose={handleClose}
                contentStyle={styles.modal}
                bodyClassName="dialog-body"
                contentClassName="dialog-content"
                actionsContainerClassName="dialog-actions"
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent>{dialog}</DialogContent>
                <DialogActions>{actions}</DialogActions>
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
