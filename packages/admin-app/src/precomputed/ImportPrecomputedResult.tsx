import { useCallback, useState, type ChangeEventHandler } from 'react';
import UploadIcon from '@mui/icons-material/Upload';
import { Button, CircularProgress, styled } from '@mui/material';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { useImportPrecomputedResult } from './useImportPrecomputedResult';
import { TaskStatus, type TaskStatusType } from '@lodex/common';
import ButtonWithDialog from '@lodex/frontend-common/components/ButtonWithDialog';
import CancelButton from '@lodex/frontend-common/components/CancelButton';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type ImportPrecomputedResultProps = {
    precomputed: {
        _id: string;
        status: TaskStatusType;
    };
};

export const ImportPrecomputedResult = ({
    precomputed,
}: ImportPrecomputedResultProps) => {
    const { translate } = useTranslate();
    const buttonLabel = translate('import');
    const [uploading, setUploading] = useState(false);
    const [open, setOpen] = useState(false);

    const importPrecomputedResult = useImportPrecomputedResult();

    const handleFileChange: ChangeEventHandler<HTMLInputElement> = async (
        event,
    ) => {
        if (!event.target.files) {
            return;
        }
        setUploading(true);
        await importPrecomputedResult({
            file: event.target.files[0],
            precomputedId: precomputed._id,
        });
        setUploading(false);
    };

    const handleOpen = useCallback(() => {
        setOpen(true);
    }, []);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const importButton = (
        <Button
            component="label"
            variant="outlined"
            className="import"
            startIcon={
                uploading ? <CircularProgress size="1em" /> : <UploadIcon />
            }
            disabled={
                uploading ||
                !(
                    [
                        TaskStatus.PENDING,
                        TaskStatus.CANCELED,
                        TaskStatus.ERROR,
                        TaskStatus.FINISHED,
                        undefined,
                    ] as TaskStatusType[]
                ).includes(precomputed.status)
            }
        >
            {buttonLabel}
            <VisuallyHiddenInput
                onChange={handleFileChange}
                type="file"
                accept="application/json"
            />
        </Button>
    );

    if (precomputed.status === TaskStatus.FINISHED) {
        return (
            <ButtonWithDialog
                handleOpen={handleOpen}
                handleClose={handleClose}
                openButton={
                    <Button
                        variant="outlined"
                        className="import"
                        startIcon={
                            uploading ? (
                                <CircularProgress size="1em" />
                            ) : (
                                <UploadIcon />
                            )
                        }
                        disabled={uploading}
                        onClick={handleOpen}
                    >
                        {buttonLabel}
                    </Button>
                }
                dialog={translate(
                    'import_precomputed_result_confirmation_message',
                )}
                label={translate(
                    'import_precomputed_result_confirmation_title',
                )}
                actions={
                    <>
                        <CancelButton onClick={handleClose}>
                            {translate('cancel')}
                        </CancelButton>
                        {importButton}
                    </>
                }
                open={open}
            />
        );
    }

    return importButton;
};
