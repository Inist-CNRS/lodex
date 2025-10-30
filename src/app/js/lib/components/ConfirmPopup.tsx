import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

import CancelButton from '@lodex/frontend-common/components/CancelButton';

const styles = {
    container: {
        paddingTop: '1rem',
    },
};

interface ConfirmPopupProps {
    title: string;
    description?: string;
    cancelLabel: string;
    confirmLabel: string;
    onConfirm(...args: unknown[]): unknown;
    isOpen: boolean;
    onCancel(...args: unknown[]): unknown;
    isLoading?: boolean;
}

export const ConfirmPopup = ({
    isOpen,

    cancelLabel,

    confirmLabel,

    title,

    description,

    onConfirm,

    onCancel,

    isLoading = false,
}: ConfirmPopupProps) => {
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
