import React from 'react';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Typography,
} from '@mui/material';
import CancelButton from '../../lib/components/CancelButton';

export const PrecomputedDataDialog = ({
    isOpen,
    data,
    p: polyglot,
    handleClose,
}) => {
    const handleDownloadData = () => {
        const file = new Blob([JSON.stringify(data)], { type: 'text/plain' });
        const element = document.createElement('a');
        element.href = URL.createObjectURL(file);
        element.download = 'precomputed-data-' + Date.now() + '.json';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>{polyglot.t('precomputed_data')}</DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                    width: '1100px',
                    border: '1px solid',
                    borderColor: 'info.main',
                }}
            >
                <Typography>{JSON.stringify(data)}</Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {polyglot.t('close')}
                    </CancelButton>
                    <Button
                        onClick={handleDownloadData}
                        color="primary"
                        variant="contained"
                    >
                        {polyglot.t('download_data')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

PrecomputedDataDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    data: PropTypes.object.isRequired,
    p: polyglotPropTypes.isRequired,
};

export default compose(translate)(PrecomputedDataDialog);
