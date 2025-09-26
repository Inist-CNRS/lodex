import { useTheme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Drawer, IconButton, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { default as React, useCallback, useMemo } from 'react';

import { useTranslate } from '../i18n/I18NContext';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { AnnotationList } from './AnnotationList';
import { MODE_CLOSED, MODES } from './HistoryDrawer.const';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

// @ts-expect-error TS7031
export function HistoryDrawer({ mode, setMode, field, resourceUri }) {
    const { translate } = useTranslate();
    const theme = useTheme();

    const open = useMemo(() => mode !== MODE_CLOSED, [mode]);

    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
        open,
    );

    const handleClose = useCallback(() => {
        setMode(MODE_CLOSED);
    }, [setMode]);

    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={handleClose}
            sx={{
                zIndex: '1399', // Have the drawer render on top of the modal preventing interaction with it
            }}
            PaperProps={{
                sx: {
                    width: '40%',
                    minWidth: '600px',
                    // @ts-expect-error TS2339
                    backgroundColor: theme.palette.grey[100],
                },
            }}
        >
            <Box display="flex" justifyContent="flex-start">
                <IconButton
                    aria-label={translate('close')}
                    size="small"
                    onClick={handleClose}
                >
                    {/*
                     // @ts-expect-error TS2769 */}
                    <CloseIcon fontSize="1rem" />
                </IconButton>
            </Box>

            {isLoading && <Typography>{translate('loading')}</Typography>}
            {!isLoading && error && (
                <AdminOnlyAlert>
                    {translate('field_annotation_query_error')}
                </AdminOnlyAlert>
            )}
            {data && (
                <AnnotationList
                    mode={mode}
                    setMode={setMode}
                    annotations={data}
                    field={field}
                />
            )}
        </Drawer>
    );
}

HistoryDrawer.propTypes = {
    mode: PropTypes.oneOf(MODES).isRequired,
    setMode: PropTypes.func.isRequired,
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
