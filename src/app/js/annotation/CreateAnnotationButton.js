import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { IconButton, Tooltip } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState } from 'react';

import { useTranslate } from '../i18n/I18NContext';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';

export function CreateAnnotationButton({
    field,
    target = 'title',
    itemPath = null,
    initialValue = null,
}) {
    const { translate } = useTranslate();
    const anchorButton = useRef(null);

    const resourceUri = useResourceUri();

    const { handleCreateAnnotation, isSubmitting } = useCreateAnnotation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);

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
                target,
                itemPath,
                fieldId: field ? field._id : null,
                initialValue,
            });

            handleCloseModal();
        },
        [field, itemPath],
    );

    const handleShowTooltip = () => {
        setIsTooltipOpen(true);
    };

    const handleHideTooltip = () => {
        setIsTooltipOpen(false);
    };

    const buttonLabel = translate(`annotation_create_button_${target}_label`, {
        field: field.label,
    });

    if (field.annotable === false) {
        return null;
    }

    const forceButtonDisplay = isTooltipOpen || isModalOpen;

    return (
        <>
            <Tooltip
                title={buttonLabel}
                placement="top"
                arrow
                open={isTooltipOpen}
            >
                <IconButton
                    color="primary"
                    onClick={handleOpenModal}
                    aria-label={buttonLabel}
                    ref={anchorButton}
                    sx={{
                        '.property_value_item &': {
                            position: 'absolute',
                            opacity: forceButtonDisplay ? 1 : 0,
                            top: '-8px',
                            right: '-40px',
                            transition: 'opacity 0.5s ease-out',
                            zIndex: 1,
                        },
                        'li:hover &, .property_value_item:hover &': {
                            opacity: 1,
                        },
                        '.list-format-unordered_flat_li &': {
                            backgroundColor: (theme) =>
                                theme.palette.background.default,
                        },
                        '.property_value_heading &, .property_value_ribbon &': {
                            top: 'calc(50% - 16px)',
                        },
                    }}
                    onMouseEnter={handleShowTooltip}
                    onMouseLeave={handleHideTooltip}
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
    target: PropTypes.oneOf(['title', 'value']),
    initialValue: PropTypes.string,
    itemPath: PropTypes.arrayOf(PropTypes.string),
};
