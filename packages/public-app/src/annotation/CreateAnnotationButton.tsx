import MapsUgcIcon from '@mui/icons-material/MapsUgc';
import {
    IconButton,
    Link,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useGetFieldAnnotationIds } from './annotationStorage';
import { CreateAnnotationModal } from './CreateAnnotationModal';
import { HistoryDrawer } from './HistoryDrawer';
import { MODE_ALL, MODE_CLOSED, MODE_MINE } from './HistoryDrawer.const';
import { useCanAnnotate } from './useCanAnnotate';
import { useCreateAnnotation } from './useCreateAnnotation';
import { useResourceUri } from './useResourceUri';
import { getReadableValue } from '../../../../src/app/js/formats/getFormat';

interface UserAnnotationCountProps {
    fieldAnnotationIds: string[];
    openHistory(...args: unknown[]): unknown;
}

function UserAnnotationCount({
    fieldAnnotationIds,
    openHistory,
}: UserAnnotationCountProps) {
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
            {translate('annotation_sent_count', {
                smart_count: fieldAnnotationIds.length,
            })}
        </Typography>
    );
}

interface CreateAnnotationButtonProps {
    field?: object;
    resource?: object;
}

export function CreateAnnotationButton({
    field,
    resource,
}: CreateAnnotationButtonProps) {
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
        // @ts-expect-error TS7006
        async (annotation) => {
            await handleCreateAnnotation({
                ...annotation,
                resourceUri,
                // @ts-expect-error TS2339
                fieldId: field ? field._id : null,
            });

            handleCloseModal();
        },
        [field, handleCreateAnnotation, handleCloseModal, resourceUri],
    );

    const handleOpenHistory = useCallback((mode = MODE_ALL) => {
        // @ts-expect-error TS2345
        setHistoryDrawerMode(mode);
    }, []);

    const handleShowTooltip = () => {
        setIsTooltipOpen(true);
    };

    const handleHideTooltip = () => {
        setIsTooltipOpen(false);
    };

    const buttonLabel = translate(`annotation_create_button_label`, {
        // @ts-expect-error TS18048
        field: field.label,
    });

    const fieldAnnotationIds = useGetFieldAnnotationIds({
        // @ts-expect-error TS18048
        fieldId: field._id,
        resourceUri,
    });
    const isFieldValueAnnotable = useMemo(() => {
        // @ts-expect-error TS18048
        return getIsFieldValueAnnotable(field.format?.name);
        // @ts-expect-error TS18048
    }, [field.format?.name]);

    // @ts-expect-error TS18048
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
                    // @ts-expect-error TS2322
                    field={field}
                    // @ts-expect-error TS2322
                    resourceUri={resourceUri}
                    openHistory={handleOpenHistory}
                />
            )}

            <HistoryDrawer
                mode={historyDrawerMode}
                setMode={setHistoryDrawerMode}
                // @ts-expect-error TS2322
                field={field}
                // @ts-expect-error TS2322
                resourceUri={resourceUri}
            />
        </>
    );
}
