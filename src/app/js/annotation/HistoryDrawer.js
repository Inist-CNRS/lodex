import { useTheme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { default as React } from 'react';

import { useTranslate } from '../i18n/I18NContext';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { AnnotationList } from './AnnotationList';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

export function HistoryDrawer({ open, onClose, field, resourceUri }) {
    const { translate } = useTranslate();
    const theme = useTheme();

    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
        open,
    );

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            sx={{
                zIndex: '1399', // Have the drawer render on top of the modal preventing interaction with it
            }}
            PaperProps={{
                sx: {
                    width: '40%',
                    minWidth: '600px',
                    backgroundColor: theme.palette.grey[100],
                },
            }}
        >
            <Box display="flex" justifyContent="flex-start">
                <IconButton
                    aria-label={translate('close')}
                    size="small"
                    onClick={onClose}
                >
                    <CloseIcon fontSize="1rem" />
                </IconButton>
            </Box>

            {isLoading && <Typography>{translate('loading')}</Typography>}
            {!isLoading && error && (
                <AdminOnlyAlert>
                    {translate('field_annotation_query_error')}
                </AdminOnlyAlert>
            )}
            {data && <AnnotationList annotations={data} field={field} />}
        </Drawer>
    );
}

HistoryDrawer.propTypes = {
    open: PropTypes.bool.isRequired,
    data: PropTypes.array.isRequired,
    onClose: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
