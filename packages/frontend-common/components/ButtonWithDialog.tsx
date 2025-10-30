import React from 'react';

import {
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
} from '@mui/material';

import CancelButton from '../../../src/app/js/lib/components/CancelButton';
import { translate } from '@lodex/frontend-common/i18n/I18NContext';

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
    p: unknown;
    open?: boolean;
    show?: boolean;
    style?: object;
    dialog: React.ReactNode;
    label: object | string;
    icon?: React.ReactNode;
    className?: string;
    actions?: React.ReactNode[];
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
    p: polyglot,
    actions = [
        <CancelButton key="cancel" onClick={handleClose}>
            {/*
             // @ts-expect-error TS18046 */}
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
            {/*
             // @ts-expect-error TS2769 */}
            {label}
        </Button>
    ),
}: PureButtonWithDialogProps) => {
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
                {/*
                 // @ts-expect-error TS2322 */}
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

export default translate(PureButtonWithDialog);
