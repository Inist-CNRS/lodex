import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';

import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import datasetApi from '../api/dataset';

export function DeleteManyButton({ selectedRowIds, reloadDataset }) {
    const { translate } = useTranslate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, [selectedRowIds]);

    const handleButtonClick = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        if (isLoading) {
            return false;
        }

        setIsModalOpen(false);
    };

    const handleDelete = async () => {
        setIsLoading(true);
        const res = await datasetApi.deleteManyDatasetRows(selectedRowIds);

        if (res.status === 'deleted') {
            toast(translate('parsing_delete_rows_success'), {
                type: toast.TYPE.SUCCESS,
            });
            reloadDataset();
            handleCloseModal();
            setIsLoading(false);
        } else {
            toast(translate('parsing_delete_rows_error'), {
                type: toast.TYPE.ERROR,
            });
        }
        setIsLoading(false);
        handleCloseModal();
    };

    if (selectedRowIds.length === 0) {
        return null;
    }

    return (
        <>
            <Button
                onClick={handleButtonClick}
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="primary"
                size="small"
            >
                {translate('parsing_delete_many_button_label')}
            </Button>
            <ConfirmPopup
                isOpen={isModalOpen}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('delete')}
                title={translate('parsing_delete_many_modal_title', {
                    smart_count: selectedRowIds.length,
                })}
                onCancel={handleCloseModal}
                onConfirm={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}

DeleteManyButton.propTypes = {
    selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    reloadDataset: PropTypes.func.isRequired,
};
