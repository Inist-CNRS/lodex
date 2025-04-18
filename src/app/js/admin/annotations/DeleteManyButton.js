import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';

import { useTranslate } from '../../i18n/I18NContext';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';
import { useDeleteManyAnnotation } from './hooks/useDeleteManyAnnotation';

export function DeleteManyButton({ selectedRowIds }) {
    const { translate } = useTranslate();
    const { mutate, isLoading } = useDeleteManyAnnotation();

    const [isModalOpen, setIsModalOpen] = React.useState(false);

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

    const handleDeleteAnnotations = async () => {
        mutate(selectedRowIds);
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
                startIcon={<DeleteIcon />}
            >
                {translate('annotation_delete_many_button_label')}
            </Button>
            <ConfirmPopup
                isOpen={isModalOpen}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('delete')}
                title={translate('annotation_delete_many_modal_title', {
                    smart_count: selectedRowIds.length,
                })}
                onCancel={handleCloseModal}
                onConfirm={handleDeleteAnnotations}
                isLoading={isLoading}
            />
        </>
    );
}

DeleteManyButton.propTypes = {
    selectedRowIds: PropTypes.arrayOf(PropTypes.string).isRequired,
};
