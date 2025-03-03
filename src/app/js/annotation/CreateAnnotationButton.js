import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import {
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { getIsFieldValueAnnotable } from '../formats';
import { useTranslate } from '../i18n/I18NContext';
import { useGetFieldAnnotationIds } from './annotationStorage';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { HistoryDrawer } from './HistoryDrawer';
import { useCanAnnotate } from './useCanAnnotate';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';

function UserAnnotationCount({ fieldAnnotationIds, openHistory }) {
    const { translate } = useTranslate();
    const theme = useTheme();

    const handleOpenHistory = (e) => {
        e.preventDefault();
        openHistory();
    };

    if (!fieldAnnotationIds.length) {
        return null;
    }

    return (
        <Typography
            color="primary"
            onClick={handleOpenHistory}
            component={Link}
            sx={{
                fontSize: '1rem',
                fontWeight: 'normal',
                color: theme.palette.primary.main,
                '&:hover': {
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    cursor: 'pointer',
                },
            }}
        >
            {translate('annotation_sent_count', {
                smart_count: fieldAnnotationIds.length,
            })}
        </Typography>
    );
}

UserAnnotationCount.propTypes = {
    fieldAnnotationIds: PropTypes.arrayOf(PropTypes.string).isRequired,
    openHistory: PropTypes.func.isRequired,
};

export function CreateAnnotationButton({ field, initialValue = null }) {
    const { translate } = useTranslate();
    const canAnnotate = useCanAnnotate();
    const anchorButton = useRef(null);

    const resourceUri = useResourceUri();

    const { handleCreateAnnotation, isSubmitting } = useCreateAnnotation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [isHistoryDrawerOpen, setIsHistoryDrawerOpen] = useState(false);

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

    const handleOpenHistory = useCallback(() => {
        setIsHistoryDrawerOpen(true);
    }, []);

    const handleCloseHistory = useCallback(() => {
        setIsHistoryDrawerOpen(false);
    }, []);

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

                <UserAnnotationCount
                    fieldAnnotationIds={fieldAnnotationIds}
                    openHistory={handleOpenHistory}
                />
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
                    openHistory={handleOpenHistory}
                />
            )}

            <HistoryDrawer
                open={isHistoryDrawerOpen}
                onClose={handleCloseHistory}
                field={field}
                resourceUri={resourceUri}
            />
        </>
    );
}

CreateAnnotationButton.propTypes = {
    field: PropTypes.object,
    initialValue: PropTypes.string,
};
