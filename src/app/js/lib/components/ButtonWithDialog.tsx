import React from 'react';
import PropTypes from 'prop-types';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from './CancelButton';
import { translate } from '../../i18n/I18NContext';

const dialogStyle = {
    container: {
        margin: '0px auto',
        marginTop: 10,
        marginBottom: 100,
        maxHeight: '100vh',
    },
    content: { maxHeight: 'calc(100vh - 298px)', width: 600 },
};

export const PureButtonWithDialog = ({
    // @ts-expect-error TS7031
    handleClose,
    // @ts-expect-error TS7031
    handleOpen,
    // @ts-expect-error TS7031
    open,
    // @ts-expect-error TS7031
    show,
    // @ts-expect-error TS7031
    style,
    // @ts-expect-error TS7031
    dialog,
    // @ts-expect-error TS7031
    className,
    // @ts-expect-error TS7031
    label,
    // @ts-expect-error TS7031
    icon,
    // @ts-expect-error TS7031
    p: polyglot,
    actions = [
        <CancelButton key="cancel" onClick={handleClose}>
            {polyglot.t('close')}
        </CancelButton>,
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
            <Dialog
                style={dialogStyle.container}
                open={open}
                onClose={handleClose}
                scroll="body"
            >
                <DialogTitle>{label}</DialogTitle>
                <DialogContent style={dialogStyle.content}>
                    <div className="dialog-body">
                        <div className="dialog-content">{dialog}</div>
                    </div>
                </DialogContent>
                <DialogActions>
                    <Box
                        display="flex"
                        justifyContent="flex-end"
                        className="dialog-actions"
                    >
                        {actions}
                    </Box>
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
