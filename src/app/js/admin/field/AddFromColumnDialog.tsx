// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
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

// @ts-expect-error TS7031
export const AddFromColumnDialogComponent = ({ onClose }) => {
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

AddFromColumnDialogComponent.propTypes = {
    onClose: PropTypes.func.isRequired,
};

export default AddFromColumnDialogComponent;
