import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';

import DialogActions from '@mui/material/DialogActions';
import PropTypes from 'prop-types';
import React from 'react';

import { useTranslate } from '../../../i18n/I18NContext';
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

            <Dialog open={isDialogOpen} onClose={handleCloseDialog}>
                <DialogTitle>
                    {translate('annotation_delete_modal_title')}
                </DialogTitle>
                <DialogActions>
                    <Button type="button" onClick={handleCloseDialog}>
                        {translate('cancel')}
                    </Button>
                    <Button
                        type="button"
                        color="warning"
                        variant="contained"
                        onClick={handleDelete}
                    >
                        {translate('delete')}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

AnnotationDeleteButton.propTypes = {
    id: PropTypes.string.isRequired,
    isSubmitting: PropTypes.bool.isRequired,
};
