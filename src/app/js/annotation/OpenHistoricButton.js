import { useTheme } from '@emotion/react';
import CloseIcon from '@mui/icons-material/Close';
import {
    Box,
    Drawer,
    IconButton,
    Link,
    Stack,
    Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { AnnotationList } from './AnnotationList';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

export const OpenHistoricButton = ({ field, resourceUri }) => {
    const { translate } = useTranslate();
    const theme = useTheme();
    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
    );
    const [isHistoryOpen, setIsHistoryOpen] = useState(false);

    return (
        <>
            <Stack
                gap={0.5}
                paddingBlockEnd={2}
                borderBottom={1}
                borderColor={theme.palette.grey[500]}
            >
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1rem',
                    }}
                >
                    {translate('annotation_history', {
                        fieldLabel: field.label,
                    })}
                </Typography>
                {isLoading && <Typography>{translate('loading')}</Typography>}
                {!isLoading && error && (
                    <AdminOnlyAlert>
                        {translate('field_annotation_query_error')}
                    </AdminOnlyAlert>
                )}
                {!isLoading &&
                    (data.length ? (
                        <Link
                            sx={{
                                color: theme.palette.primary.main,
                                fontSize: '1rem',
                                '&:hover': {
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none',
                                },
                            }}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                setIsHistoryOpen(true);
                            }}
                        >
                            {translate('annotation_open_history', {
                                smart_count: data.length,
                            })}
                        </Link>
                    ) : (
                        <Typography
                            color="text.secondary"
                            sx={{
                                fontSize: '1rem',
                            }}
                        >
                            {translate('annotation_no_history')}
                        </Typography>
                    ))}
            </Stack>
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
                        backgroundColor: theme.palette.grey[100],
                    },
                }}
            >
                <Box display="flex" justifyContent="flex-start">
                    <IconButton
                        aria-label={translate('close')}
                        size="small"
                        onClick={() => setIsHistoryOpen(false)}
                    >
                        <CloseIcon fontSize="1rem" />
                    </IconButton>
                </Box>
                {data && <AnnotationList annotations={data} field={field} />}
            </Drawer>
        </>
    );
};

OpenHistoricButton.propTypes = {
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
