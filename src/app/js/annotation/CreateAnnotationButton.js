import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { IconButton } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useState } from 'react';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceId } from './useResourceId';

export function CreateAnnotationButton({ field }) {
    const resourceId = useResourceId();
    const itemPath = useMemo(() => {
        if (field) {
            return [field._id];
        }

        return null;
    });

    const { handleCreateAnnotation, isSubmitting } = useCreateAnnotation();

    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    const handleSubmitAnnotation = useCallback(
        async (annotation) => {
            await handleCreateAnnotation({
                ...annotation,
                resourceId,
                itemPath,
            });

            handleCloseModal();
        },
        [field],
    );

    return (
        <>
            <CreateAnnotationModal
                isOpen={isModalOpen}
                isSubmitting={isSubmitting}
                onClose={handleCloseModal}
                onSubmit={handleSubmitAnnotation}
            />

            <IconButton color="primary" onClick={handleOpenModal}>
                <MapsUgcIcon
                    sx={{
                        fontSize: '1.2rem',
                    }}
                />
            </IconButton>
        </>
    );
}

CreateAnnotationButton.propTypes = {
    field: PropTypes.object,
};
