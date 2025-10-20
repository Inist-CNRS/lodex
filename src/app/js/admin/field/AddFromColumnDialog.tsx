// @ts-expect-error TS6133
import React from 'react';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';

import ParsingExcerpt from '../parsing/ParsingExcerpt';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';

interface AddFromColumnDialogComponentProps {
    onClose(...args: unknown[]): unknown;
}

export const AddFromColumnDialogComponent = ({
    onClose
}: AddFromColumnDialogComponentProps) => {
    const { translate } = useTranslate();

    return (
        <Dialog
            open
            onClose={onClose}
            maxWidth="xl"
            PaperProps={{ sx: { height: '90vh' } }}
        >
            <DialogTitle> {translate('a_column')}</DialogTitle>
            <DialogContent>
                <Box display="flex" p={2} width="1000px">
                    {/*
                     // @ts-expect-error TS2322 */}
                    <ParsingExcerpt showAddFromColumn onAddField={onClose} />
                </Box>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onClose}>
                    {translate('Cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

export default AddFromColumnDialogComponent;
