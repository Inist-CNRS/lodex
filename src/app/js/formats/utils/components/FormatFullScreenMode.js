import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import DialogContent from '@mui/material/DialogContent';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import Tooltip from '@mui/material/Tooltip';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../../propTypes';

const FormatFullScreenMode = ({ children, p }) => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <>
            <div>
                {!open ? children : null}

                <Tooltip title={p.t('fullscreen')} placement="left">
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
            </div>

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
                        {open ? children : null}
                    </fieldset>
                </DialogContent>
            </Dialog>
        </>
    );
};

FormatFullScreenMode.propTypes = {
    children: PropTypes.node.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default translate(FormatFullScreenMode);
