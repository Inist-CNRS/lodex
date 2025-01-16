import React, { useState } from 'react';
import { Button } from '@mui/material';
import { deleteEnrichment } from '../api/enrichment';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { ConfirmPopup } from '../../lib/components/ConfirmPopup';

export function DeleteEnrichmentButton({
    disabled,
    onDeleteStart,
    onDeleteEnd,
    id,
    history,
    polyglot,
}) {
    const [isConfirmPopupOpen, setIsConfirmPopupOpen] = useState(false);
    const handleDeleteEnrichment = async () => {
        onDeleteStart();
        const res = await deleteEnrichment(id);
        if (res.response) {
            toast(polyglot.t('enrichment_deleted_success'), {
                type: toast.TYPE.SUCCESS,
            });
            history.push('/data/enrichment');
        } else {
            toast(`${res.error}`, {
                type: toast.TYPE.ERROR,
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
                {polyglot.t('delete')}
            </Button>
            <ConfirmPopup
                cancelLabel={polyglot.t('Cancel')}
                confirmLabel={polyglot.t('Accept')}
                title={polyglot.t('confirm_enrichment_deletion_title')}
                description={polyglot.t(
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

DeleteEnrichmentButton.propTypes = {
    disabled: PropTypes.bool,
    polyglot: polyglotPropTypes,
    id: PropTypes.string.isRequired,
    onDeleteStart: PropTypes.func,
    onDeleteEnd: PropTypes.func,
    history: PropTypes.object.isRequired,
};
