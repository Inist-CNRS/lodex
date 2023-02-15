import React from 'react';
import compose from 'recompose/compose';
import datasetApi from '../api/dataset';
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
import { toast } from '../../../../common/tools/toast';

export const ParsingDeleteRowDialog = ({
    isOpen,
    p: polyglot,
    handleClose,
    selectedRowForDelete,
    reloadDataset,
}) => {
    const [isLoading, setIsLoading] = React.useState(false);

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await datasetApi.deleteDatasetRow(
            selectedRowForDelete?._id,
        );

        if (res.status === 'deleted') {
            toast.success(polyglot.t('parsing_delete_row_success'), {
                type: toast.TYPE.SUCCESS,
            });
            reloadDataset();
            handleClose();
            setIsLoading(false);
        } else {
            toast.error(polyglot.t('parsing_delete_row_error'), {
                type: toast.TYPE.ERROR,
            });
        }
        setIsLoading(false);
        handleClose();
    };

    return (
        <Dialog open={isOpen} onClose={handleClose} scroll="body" maxWidth="lg">
            <DialogTitle>
                {polyglot.t('parsing_delete_row_title')}:{' '}
                {selectedRowForDelete?.uri}
            </DialogTitle>
            <DialogContent
                style={{
                    margin: 20,
                    padding: 10,
                    width: '1100px',
                }}
            >
                <Typography variant="body1">
                    {polyglot.t('parsing_delete_row_description')}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Box display="flex" justifyContent="flex-end">
                    <Button
                        onClick={handleClose}
                        color="primary"
                        variant="link"
                    >
                        {polyglot.t('close')}
                    </Button>
                    <Button
                        onClick={handleDelete}
                        color="primary"
                        variant="contained"
                        disabled={isLoading}
                    >
                        {isLoading
                            ? polyglot.t('deleting')
                            : polyglot.t('delete')}
                    </Button>
                </Box>
            </DialogActions>
        </Dialog>
    );
};

ParsingDeleteRowDialog.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    handleClose: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    selectedRowForDelete: PropTypes.object,
    reloadDataset: PropTypes.func.isRequired,
};

export default compose(translate)(ParsingDeleteRowDialog);
