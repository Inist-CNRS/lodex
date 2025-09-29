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
// @ts-expect-error TS6133
import React, { useCallback, useMemo, useRef, useState } from 'react';

import { getIsFieldValueAnnotable, getReadableValue } from '../formats';
import { useTranslate } from '../i18n/I18NContext';
import { useGetFieldAnnotationIds } from './annotationStorage';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { HistoryDrawer } from './HistoryDrawer';
import { MODE_ALL, MODE_CLOSED, MODE_MINE } from './HistoryDrawer.const';
import { useCanAnnotate } from './useCanAnnotate';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';

// @ts-expect-error TS7031
function UserAnnotationCount({ fieldAnnotationIds, openHistory }) {
    const { translate } = useTranslate();
    const theme = useTheme();

    // @ts-expect-error TS7006
    const handleOpenHistory = (e) => {
        e.preventDefault();
        openHistory(MODE_MINE);
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
                textDecoration: 'none',
                '&:hover': {
                    color: theme.palette.primary.main,
                    textDecoration: 'underline',
                    cursor: 'pointer',
                },
            }}
        >
            {/*
             // @ts-expect-error TS2554 */}
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

// @ts-expect-error TS7031
export function CreateAnnotationButton({ field, resource }) {
    const { translate } = useTranslate();
    const readableInitialValue = getReadableValue({
        field,
        resource,
    });
    const canAnnotate = useCanAnnotate();
    const anchorButton = useRef(null);

    const resourceUri = useResourceUri();

    const { handleCreateAnnotation, isSubmitting } = useCreateAnnotation();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isTooltipOpen, setIsTooltipOpen] = useState(false);
    const [historyDrawerMode, setHistoryDrawerMode] = useState(MODE_CLOSED);

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

    const handleOpenHistory = useCallback((mode = MODE_ALL) => {
        setHistoryDrawerMode(mode);
    }, []);

    const handleShowTooltip = () => {
        setIsTooltipOpen(true);
    };

    const handleHideTooltip = () => {
        setIsTooltipOpen(false);
    };

    // @ts-expect-error TS2554
    const buttonLabel = translate(`annotation_create_button_label`, {
        field: field.label,
    });

    const fieldAnnotationIds = useGetFieldAnnotationIds({
        fieldId: field._id,
        resourceUri,
    });
    const isFieldValueAnnotable = useMemo(() => {
        return getIsFieldValueAnnotable(field.format?.name);
    }, [field.format?.name]);

    if (field.annotable === false) {
        return null;
    }

    if (!canAnnotate) {
        return null;
    }

    return (
        <>
            <Stack direction="row" alignItems="center" gap={1}>
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
                    initialValue={readableInitialValue}
                    isFieldValueAnnotable={isFieldValueAnnotable}
                    field={field}
                    resourceUri={resourceUri}
                    openHistory={handleOpenHistory}
                />
            )}

            <HistoryDrawer
                mode={historyDrawerMode}
                setMode={setHistoryDrawerMode}
                field={field}
                resourceUri={resourceUri}
            />
        </>
    );
}

CreateAnnotationButton.propTypes = {
    field: PropTypes.object,
    resource: PropTypes.object,
};
