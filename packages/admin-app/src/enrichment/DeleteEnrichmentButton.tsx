import { useState } from 'react';
import { Button } from '@mui/material';
import { deleteEnrichment } from '../api/enrichment';
import { toast } from 'react-toastify';
import { ConfirmPopup } from '../../../../src/app/js/lib/components/ConfirmPopup';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';

type DeleteEnrichmentButtonProps = {
    disabled?: boolean;
    id: string;
    onDeleteStart: () => void;
    onDeleteEnd: () => void;
    history: {
        push: (path: string) => void;
    };
};

export function DeleteEnrichmentButton({
    disabled,
    onDeleteStart,
    onDeleteEnd,
    id,
    history,
}: DeleteEnrichmentButtonProps) {
    const { translate } = useTranslate();
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const handleDeleteEnrichment = async () => {
        onDeleteStart();
        const res = await deleteEnrichment(id);
        if (res.response) {
            toast(translate('enrichment_deleted_success'), {
                type: 'success',
            });
            history.push('/data/enrichment');
        } else {
            toast(`${res.error}`, {
                type: 'error',
            });
        }
        onDeleteEnd();
    };
    return (
        <>
            <Button
                variant="contained"
                color="warning"
                sx={{ height: '100%' }}
                onClick={() => setIsConfirmPopupOpen(true)}
                disabled={disabled}
            >
                {translate('delete')}
            </Button>
            <ConfirmPopup
                cancelLabel={translate('Cancel')}
                confirmLabel={translate('Accept')}
                title={translate('confirm_enrichment_deletion_title')}
                description={translate(
                    'confirm_enrichment_deletion_description',
                )}
                isOpen={isConfirmPopupOpen}
                onCancel={() => {
                    setIsConfirmPopupOpen(false);
                }}
                onConfirm={() => {
                    handleDeleteEnrichment();
                    setIsConfirmPopupOpen(false);
                }}
            />
        </>
    );
}
