import React from 'react';
import PropTypes from 'prop-types';
import translate from 'redux-polyglot/translate';

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

const TransformerRemoveAllDialog = ({
    removeAll,
    isOpen = false,
    handleClose,
    p: polyglot,
}) => {
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

TransformerRemoveAllDialog.propTypes = {
    removeAll: PropTypes.func.isRequired,
    handleClose: PropTypes.func.isRequired,
    isOpen: PropTypes.bool,
    p: polyglotPropTypes.isRequired,
};

export default translate(TransformerRemoveAllDialog);
