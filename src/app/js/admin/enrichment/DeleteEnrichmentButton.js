import React from 'react';
import { Button } from '@mui/material';
import { deleteEnrichment } from '../api/enrichment';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import { polyglot as polyglotPropTypes } from '../../propTypes';

export function DeleteEnrichmentButton({
    disabled,
    onDeleteStart,
    onDeleteEnd,
    id,
    polyglot,
}) {
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
                onClick={handleDeleteEnrichment}
                disabled={disabled}
            >
                {polyglot.t('delete')}
            </Button>
        </>
    );
}

DeleteEnrichmentButton.propTypes = {
    disabled: PropTypes.bool,
    polyglot: polyglotPropTypes,
    id: PropTypes.string.isRequired,
    onDeleteStart: PropTypes.func,
    onDeleteEnd: PropTypes.func,
};
