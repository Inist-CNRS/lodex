import Button from '@mui/material/Button';

import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../../i18n/I18NContext';
import { ConfirmPopup } from '../../../lib/components/ConfirmPopup';
import { useDeleteAnnotation } from '../hooks/useDeleteAnnotation';

export function AnnotationDeleteButton({ id, isSubmitting }) {
    const { translate } = useTranslate();
    const { mutateAsync, isLoading } = useDeleteAnnotation(id);

    const [isDialogOpen, setIsDialogOpen] = React.useState(false);

    const handleOpenModal = () => {
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };

    const handleDelete = async () => {
        return mutateAsync();
    };

    return (
        <>
            <Button
                type="button"
                color="warning"
                variant="contained"
                disabled={isSubmitting || isLoading}
                onClick={handleOpenModal}
                aria-label={translate('annotation_delete_button_label')}
            >
                {translate('delete')}
            </Button>

            <ConfirmPopup
                isOpen={isDialogOpen}
                onCancel={handleCloseDialog}
                onConfirm={handleDelete}
                title={translate('annotation_delete_modal_title')}
                cancelLabel={translate('cancel')}
                confirmLabel={translate('delete')}
            />
        </>
    );
}

AnnotationDeleteButton.propTypes = {
    id: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};
