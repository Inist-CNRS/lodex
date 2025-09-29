import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';

import CancelButton from './CancelButton';

const styles = {
    container: {
        paddingTop: '1rem',
    },
};

export const ConfirmPopup = ({
    // @ts-expect-error TS7031
    isOpen,
    // @ts-expect-error TS7031
    cancelLabel,
    // @ts-expect-error TS7031
    confirmLabel,
    // @ts-expect-error TS7031
    title,
    // @ts-expect-error TS7031
    description,
    // @ts-expect-error TS7031
    onConfirm,
    // @ts-expect-error TS7031
    onCancel,
    isLoading = false,
}) => {
    return (
        <Dialog maxWidth="xl" open={isOpen} onClose={onCancel}>
            <DialogTitle>{title}</DialogTitle>
            {description && (
                <DialogContent>
                    <Box sx={styles.container} id="confirm-upload">
                        {description}
                    </Box>
                </DialogContent>
            )}
            <DialogActions>
                <CancelButton
                    key="cancel"
                    onClick={onCancel}
                    disabled={isLoading}
                >
                    {cancelLabel}
                </CancelButton>
                <Button
                    variant="contained"
                    color="primary"
                    key="confirm"
                    onClick={onConfirm}
                    disabled={isLoading}
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
    isLoading: PropTypes.bool,
};
