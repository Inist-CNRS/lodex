import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import CancelButton from './CancelButton';

const styles = {
    container: {
        paddingBottom: '1rem',
    },
};

export const ConfirmPopup = ({
    isOpen,
    cancelLabel,
    confirmLabel,
    title,
    description,
    onConfirm,
    onCancel,
}) => {
    return (
        <Dialog open={isOpen} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            {description && (
                <DialogContent>
                    <Box sx={styles.container} id="confirm-upload">
                        {description}
                    </Box>
                </DialogContent>
            )}
            <DialogActions>
                <CancelButton key="cancel" onClick={onCancel}>
                    {cancelLabel}
                </CancelButton>
                <Button
                    variant="contained"
                    color="primary"
                    key="confirm"
                    onClick={onConfirm}
                >
                    {confirmLabel}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

ConfirmPopup.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    cancelLabel: PropTypes.string.isRequired,
    confirmLabel: PropTypes.string.isRequired,
    onConfirm: PropTypes.func.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onCancel: PropTypes.func.isRequired,
};
