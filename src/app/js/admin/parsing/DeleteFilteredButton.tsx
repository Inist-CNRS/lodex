import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React, { useEffect, useState } from 'react';

import {
    gridRowCountSelector,
    useGridApiContext,
    useGridSelector,
} from '@mui/x-data-grid';
import { toast } from '../../../../common/tools/toast';
import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import datasetApi from '../api/dataset';

// @ts-expect-error TS7031
export function DeleteFilteredButton({ filter, reloadDataset }) {
    const apiRef = useGridApiContext();
    const rowCount = useGridSelector(apiRef, gridRowCountSelector);

    const { translate } = useTranslate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsModalOpen(false);
    }, [filter]);

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
        const res = await datasetApi.deleteFilteredDatasetRows(filter);

        if (res.status === 'deleted') {
            toast(translate('parsing_delete_rows_success'), {
                type: toast.TYPE.SUCCESS,
            });
            apiRef.current.setFilterModel({
                items: [],
                // @ts-expect-error TS2322
                linkOperator: 'and',
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

    if (filter.value === undefined || rowCount === 0) {
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
                {translate('parsing_delete_filtered_button_label')}
            </Button>
            <ConfirmPopup
                isOpen={isModalOpen}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('delete')}
                title={translate('parsing_delete_filtered_modal_title')}
                onCancel={handleCloseModal}
                onConfirm={handleDelete}
                isLoading={isLoading}
            />
        </>
    );
}

DeleteFilteredButton.propTypes = {
    filter: PropTypes.object.isRequired,
    reloadDataset: PropTypes.func.isRequired,
};
