import { Button, Typography } from '@mui/material';
import React from 'react';
import { useTranslate } from '../i18n/I18NContext';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';

export const OpenHistoricButton = ({ field, resourceUri }) => {
    const { translate } = useTranslate();
    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
    );

    return (
        <>
            <Typography variant="h6">
                {translate('annotation_historic', { fieldLabel: field.label })}
            </Typography>
            {isLoading && <Typography>{translate('loading')}</Typography>}
            {!isLoading && error && (
                <AdminOnlyAlert>
                    {translate('field_annotation_query_error')}
                </AdminOnlyAlert>
            )}
            {!isLoading && data.length ? (
                <Button variant="link" onClick={() => {}}>
                    {translate('annotation_open_historic', {
                        smart_count: data.length,
                    })}
                </Button>
            ) : (
                <Button variant="link" disabled>
                    {translate('annotation_no_historic')}
                </Button>
            )}
        </>
    );
};
