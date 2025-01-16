import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';
import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Box,
} from '@mui/material';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import ParsingExcerpt from '../parsing/ParsingExcerpt';
import CancelButton from '../../lib/components/CancelButton';

export const AddFromColumnDialogComponent = ({ p: polyglot, onClose }) => {
    return (
        <Dialog
            open
            onClose={onClose}
            maxWidth="xl"
            PaperProps={{ sx: { height: '90vh' } }}
        >
            <DialogTitle> {polyglot.t('a_column')}</DialogTitle>
            <DialogContent>
                <Box display="flex" p={2} width="1000px">
                    <ParsingExcerpt showAddFromColumn onAddField={onClose} />
                </Box>
            </DialogContent>
            <DialogActions>
                <CancelButton onClick={onClose}>
                    {polyglot.t('Cancel')}
                </CancelButton>
            </DialogActions>
        </Dialog>
    );
};

AddFromColumnDialogComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    onClose: PropTypes.func.isRequired,
};

export default translate(AddFromColumnDialogComponent);
