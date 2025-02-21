import React, { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';

import datasetApi from '../api/dataset';
import publishApi from '../api/publish';
import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import { toast } from '../../../../common/tools/toast';

export function DeleteManyButton({
    selectedRowIds,
    reloadDataset,
    isPublished,
}) {
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
            toast(translate('parsing_delete_row_success'), {
                type: toast.TYPE.SUCCESS,
            });
            reloadDataset();
            if (isPublished) {
                publishApi.publish();
            }
            handleCloseModal();
            setIsLoading(false);
        } else {
            toast(translate('parsing_delete_row_error'), {
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
    isPublished: PropTypes.bool.isRequired,
};
