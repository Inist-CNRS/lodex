import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import { IconButton, Stack, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { useTranslate } from '../i18n/I18NContext';
import { useGetFieldAnnotationIds } from './annotationStorage';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { useCanAnnotate } from './useCanAnnotate';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';
import { getIsFieldValueAnnotable } from '../formats';

export function CreateAnnotationButton({ field, initialValue = null }) {
    const { translate } = useTranslate();
    const canAnnotate = useCanAnnotate();
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
                fieldId: field ? field._id : null,
            });

            handleCloseModal();
        },
        [field, handleCreateAnnotation, handleCloseModal, resourceUri],
    );

    const handleShowTooltip = () => {
        setIsTooltipOpen(true);
    };

    const handleHideTooltip = () => {
        setIsTooltipOpen(false);
    };

    const buttonLabel = translate(`annotation_create_button_label`, {
        field: field.label,
    });

    const fieldAnnotationIds = useGetFieldAnnotationIds({
        fieldId: field._id,
        resourceUri,
    });
    const isFieldValueAnnotable = useMemo(() => {
        if (!initialValue) {
            return false;
        }
        return getIsFieldValueAnnotable(field.format?.name);
    }, [field.format?.name, initialValue]);

    if (field.annotable === false) {
        return null;
    }

    const forceButtonDisplay = isTooltipOpen || isModalOpen;

    if (!canAnnotate) {
        return null;
    }

    return (
        <>
            <Stack direction="row" alignItems="center">
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
                            '.property_value_heading &, .property_value_ribbon &':
                                {
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
                {fieldAnnotationIds.length > 0 && (
                    <Typography color="primary" variant="caption">
                        {translate('annotation_sent_count', {
                            smart_count: fieldAnnotationIds.length,
                        })}
                    </Typography>
                )}
            </Stack>

            {anchorButton.current && isModalOpen && (
                <CreateAnnotationModal
                    isSubmitting={isSubmitting}
                    onClose={handleCloseModal}
                    onSubmit={handleSubmitAnnotation}
                    anchorEl={anchorButton.current}
                    initialValue={initialValue}
                    isFieldValueAnnotable={isFieldValueAnnotable}
                    field={field}
                    resourceUri={resourceUri}
                />
            )}
        </>
    );
}

CreateAnnotationButton.propTypes = {
    field: PropTypes.object,
    initialValue: PropTypes.string,
};
