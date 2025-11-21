import CloseIcon from '@mui/icons-material/Close';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import { Stack, Typography } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import React, { useContext, useRef, useState } from 'react';
import {
    GraphContext,
    GraphContextProvider,
} from '../../../../public-app/src/graph/GraphContext';
import { useTranslate } from '../../../i18n/I18NContext';

interface FormatFullScreenModeProps {
    children: React.ReactNode;
    fill?: string;
}

const FormatFullScreenMode = ({
    children,
    fill,
}: FormatFullScreenModeProps) => {
    const { translate } = useTranslate();
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const externalContext = useContext(GraphContext);
    const graphActionRef = useRef<HTMLDivElement | null>(null);

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
                    <OpenInFullIcon
                        sx={{
                            color: fill || 'var(--text-main)',
                        }}
                    />
                </IconButton>
            </Tooltip>

            {open && (
                <GraphContextProvider
                    portalContainer={graphActionRef}
                    field={externalContext?.field}
                >
                    <Dialog fullScreen={true} open={open} onClose={handleClose}>
                        <DialogContent
                            dividers
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem',
                            }}
                        >
                            <Stack
                                direction="row"
                                sx={{
                                    height: '3rem',
                                    alignItems: 'center',
                                    gap: '1rem',
                                }}
                            >
                                {externalContext?.field && (
                                    <Typography
                                        sx={{
                                            color: 'grey.500',
                                            fontWeight: 'bold',
                                            fontSize: '1.25rem',
                                        }}
                                    >
                                        {externalContext.field.label}
                                    </Typography>
                                )}
                                <Stack
                                    flex="1"
                                    direction="row"
                                    gap="0.5rem"
                                    justifyContent="flex-end"
                                    ref={graphActionRef}
                                />

                                <IconButton
                                    aria-label="close"
                                    onClick={handleClose}
                                    sx={{
                                        color: 'var(--text-main)',
                                        backgroundColor: 'rgba(0,0,0,0.025)',
                                    }}
                                >
                                    <CloseIcon />
                                </IconButton>
                            </Stack>
                            <fieldset
                                style={{
                                    position: 'relative',
                                    borderRadius: '0.25rem',
                                    paddingInline: '0rem',
                                    width: 'calc(100vw - 3rem)',
                                    margin: 0,
                                    height: '100%',
                                    maxHeight: 'calc(100% - 3rem - 1rem)',
                                    overflow: 'auto',
                                }}
                            >
                                {children}
                            </fieldset>
                        </DialogContent>
                    </Dialog>
                </GraphContextProvider>
            )}
        </>
    );
};

export default FormatFullScreenMode;
