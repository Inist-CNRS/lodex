import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useTranslate } from '../i18n/I18NContext';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';

export function CreateAnnotationButton({ field }) {
    const { translate } = useTranslate();
    const anchorButton = useRef(null);

    const resourceUri = useResourceUri();
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
                resourceUri,
                itemPath,
            });

            handleCloseModal();
        },
        [field],
    );

    const buttonLabel = translate('annotation_create_button_label', {
        field: field.label,
    });

    if (field.annotable === false) {
        return null;
    }

    return (
        <>
            <Tooltip title={buttonLabel} arrow placement="top">
                <IconButton
                    color="primary"
                    onClick={handleOpenModal}
                    aria-label={buttonLabel}
                    ref={anchorButton}
                >
                    <MapsUgcIcon
                        sx={{
                            fontSize: '1.2rem',
                        }}
                    />
                </IconButton>
            </Tooltip>

            {anchorButton.current && isModalOpen && (
                <CreateAnnotationModal
                    isSubmitting={isSubmitting}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitAnnotation}
                    anchorEl={anchorButton.current}
                />
            )}
        </>
    );
}

CreateAnnotationButton.propTypes = {
    field: PropTypes.object,
};
