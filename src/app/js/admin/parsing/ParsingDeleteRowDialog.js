import React from 'react';
import datasetApi from '../api/dataset';
import publishApi from '../api/publish';
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
import { toast } from '../../../../common/tools/toast';
import CancelButton from '../../lib/components/CancelButton';
import { useTranslate } from '../../i18n/I18NContext';

export const ParsingDeleteRowDialog = ({
    isOpen,
    handleClose,
    selectedRowForDelete,
    reloadDataset,
    shouldRepublish,
}) => {
    const { translate } = useTranslate();
    const [isLoading, setIsLoading] = React.useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await datasetApi.deleteDatasetRow(
            selectedRowForDelete?._id,
        );

        if (res.status === 'deleted') {
            toast(translate('parsing_delete_row_success'), {
                type: toast.TYPE.SUCCESS,
            });
            reloadDataset();
            if (shouldRepublish) {
                publishApi.publish();
            }
            handleClose();
            setIsLoading(false);
        } else {
            toast(translate('parsing_delete_row_error'), {
                type: toast.TYPE.ERROR,
            });
        }
        setIsLoading(false);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>
                {translate('parsing_delete_row_title')}:{' '}
                {selectedRowForDelete?.uri}
            </DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                }}
            >
                <Typography variant="body1">
                    {translate('parsing_delete_row_description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <CancelButton onClick={handleClose}>
                        {translate('cancel')}
                    </CancelButton>
                    <Button
                        onClick={handleDelete}
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? translate('deleting')
                            : translate('confirm')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

ParsingDeleteRowDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    selectedRowForDelete: PropTypes.object,
    reloadDataset: PropTypes.func.isRequired,
    shouldRepublish: PropTypes.bool,
};

export default ParsingDeleteRowDialog;
