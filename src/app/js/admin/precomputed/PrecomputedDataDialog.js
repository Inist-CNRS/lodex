import React, { useEffect, useState } from 'react';
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
import {
    exportPrecomputedData,
    previewPrecomputedData,
} from '../api/precomputed';
import { useTranslate } from '../../i18n/I18NContext';

export const PrecomputedDataDialog = ({
    isOpen,
    precomputedID,
    handleClose,
}) => {
    const { translate } = useTranslate();
    const [previewData, setPreviewData] = useState(null);
    useEffect(() => {
        async function fetchData() {
            const { response } = await previewPrecomputedData(precomputedID);
            setPreviewData(response);
        }

        isOpen && fetchData();
    }, [isOpen]);

    const handleDownloadData = () => {
        exportPrecomputedData(precomputedID).then((response) => {
            const file = new Blob([response], { type: 'text/plain' });
            const element = document.createElement('a');
            element.href = URL.createObjectURL(file);
            element.download = 'precomputed-data-' + Date.now() + '.json';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
        });
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>{translate('precomputed_data')}</DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                    width: '1100px',
                    border: '1px solid',
                    borderColor: 'info.main',
                }}
            >
                <Typography>{JSON.stringify(previewData)}</Typography>
                <br />
                <Typography sx={{ fontWeight: 'bold' }}>
                    {translate('precomputed_data_limit')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {translate('close')}
                    </CancelButton>
                    <Button
                        onClick={handleDownloadData}
                        color="primary"
                        variant="contained"
                    >
                        {translate('download_data')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

PrecomputedDataDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    precomputedID: PropTypes.object.isRequired,
};

export default PrecomputedDataDialog;
