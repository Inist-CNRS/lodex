import React from 'react';

import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import { useTranslate } from '../i18n/I18NContext';
import CancelButton from './CancelButton';

const dialogStyle = {
    container: {
        margin: '0px auto',
        marginTop: 10,
        marginBottom: 100,
        maxHeight: '100vh',
    },
    content: { maxHeight: 'calc(100vh - 298px)', width: 600 },
};

interface PureButtonWithDialogProps {
    handleClose?(...args: unknown[]): unknown;
    handleOpen?(...args: unknown[]): unknown;
    open?: boolean;
    show?: boolean;
    style?: object;
    dialog: React.ReactNode;
    label: string;
    icon?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode[] | React.ReactNode;
    openButton?: React.ReactNode;
}

export const PureButtonWithDialog = ({
    handleClose,
    handleOpen,
    open = false,
    show = true,
    style,
    dialog,
    className,
    label,
    icon,
    actions,
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
}: PureButtonWithDialogProps) => {
    const { translate } = useTranslate();
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
                aria-labelledby="dialog-title"
            >
                <DialogTitle id="dialog-title">{label}</DialogTitle>
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
                        {actions ?? [
                            <CancelButton key="cancel" onClick={handleClose}>
                                {translate('close')}
                            </CancelButton>,
                        ]}
                    </Box>
                </DialogActions>
            </Dialog>
        </span>
    );
};

export default PureButtonWithDialog;
