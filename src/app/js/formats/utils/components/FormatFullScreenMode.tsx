import React, { useState } from 'react';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import Tooltip from '@mui/material/Tooltip';
import { useTranslate } from '../../../i18n/I18NContext';

interface FormatFullScreenModeProps {
    children: React.ReactNode;
}

const FormatFullScreenMode = ({ children }: FormatFullScreenModeProps) => {
    const { translate } = useTranslate();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            {open === false && children}

            <Tooltip title={translate('fullscreen')} placement="left">
                <IconButton
                    onClick={handleClickOpen}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        bottom: 8,
                    }}
                >
                    <OpenInFullIcon />
                </IconButton>
            </Tooltip>

            {open && (
                <Dialog fullScreen={true} open={open} onClose={handleClose}>
                    <IconButton
                        aria-label="close"
                        onClick={handleClose}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: 'var(--text-main)',
                            backgroundColor: 'rgba(0,0,0,0.025)',
                            zIndex: 99999,
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                    <DialogContent dividers>
                        <fieldset
                            style={{
                                borderRadius: '5px',
                                margin: '24px',
                                height: '100%',
                                maxHeight: 'calc(100% - 48px)',
                                overflow: 'scroll',
                            }}
                        >
                            {children}
                        </fieldset>
                    </DialogContent>
                </Dialog>
            )}
        </>
    );
};

export default FormatFullScreenMode;
