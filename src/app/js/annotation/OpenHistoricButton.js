import { Button, Drawer, Typography } from '@mui/material';
import React, { useState } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { AnnotationList } from './AnnotationList';
import PropTypes from 'prop-types';

export const OpenHistoricButton = ({ field, resourceUri }) => {
    const { translate } = useTranslate();
    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
    );
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <>
            <Typography variant="h6">
                {translate('annotation_history', { fieldLabel: field.label })}
            </Typography>
            {isLoading && <Typography>{translate('loading')}</Typography>}
            {!isLoading && error && (
                <AdminOnlyAlert>
                    {translate('field_annotation_query_error')}
                </AdminOnlyAlert>
            )}
            {!isLoading &&
                (data.length ? (
                    <Button
                        variant="link"
                        onClick={() => {
                            setIsHistoryOpen(true);
                        }}
                    >
                        {translate('annotation_open_history', {
                            smart_count: data.length,
                        })}
                    </Button>
                ) : (
                    <Button variant="link" disabled>
                        {translate('annotation_no_history')}
                    </Button>
                ))}
            <Drawer
                anchor="right"
                open={isHistoryOpen}
                onClose={() => setIsHistoryOpen(false)}
                sx={{
                    zIndex: '1399', // Have the drawer render on top of the modal preventing interaction with it
                }}
                PaperProps={{
                    sx: {
                        width: '40%',
                        minWidth: '600px',
                    },
                }}
            >
                <AnnotationList annotations={data} field={field} />
            </Drawer>
        </>
    );
};

OpenHistoricButton.propTypes = {
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
