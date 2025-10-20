// @ts-expect-error TS6133
import React from 'react';
import { translate } from '../../i18n/I18NContext';

import {
    Box,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    DialogActions,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import CancelButton from '../../lib/components/CancelButton';

interface TransformerRemoveAllDialogProps {
    removeAll(...args: unknown[]): unknown;
    handleClose(...args: unknown[]): unknown;
    isOpen?: boolean;
    p: unknown;
}

const TransformerRemoveAllDialog = ({
    removeAll,

    isOpen = false,

    handleClose,

    p: polyglot
}: TransformerRemoveAllDialogProps) => {
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
                {polyglot.t('transformer_delete_all_title')}
            </DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                }}
            >
                <Typography variant="body1">
                    {polyglot.t('transformer_delete_all_description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {polyglot.t('cancel')}
                    </CancelButton>
                    <Button
                        onClick={handleRemoveAll}
                        variant="contained"
                        className="confirm-delete-all"
                    >
                        {polyglot.t('confirm')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

export default translate(TransformerRemoveAllDialog);
