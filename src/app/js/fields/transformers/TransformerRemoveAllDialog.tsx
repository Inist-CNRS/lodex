import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    DialogActions,
} from '@mui/material';

import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

interface TransformerRemoveAllDialogProps {
    removeAll(...args: unknown[]): unknown;
    handleClose(...args: unknown[]): unknown;
    isOpen?: boolean;
}

const TransformerRemoveAllDialog = ({
    removeAll,
    isOpen = false,
    handleClose,
}: TransformerRemoveAllDialogProps) => {
    const { translate } = useTranslate();
    const handleRemoveAll = () => {
        removeAll();
        handleClose();
    };
    if (!isOpen) {
        return null;
    }

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>
                {translate('transformer_delete_all_title')}
            </DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                }}
            >
                <Typography variant="body1">
                    {translate('transformer_delete_all_description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {translate('cancel')}
                    </CancelButton>
                    <Button
                        onClick={handleRemoveAll}
                        variant="contained"
                        className="confirm-delete-all"
                    >
                        {translate('confirm')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default TransformerRemoveAllDialog;
