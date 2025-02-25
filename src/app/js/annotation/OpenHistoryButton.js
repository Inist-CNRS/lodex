import { useTheme } from '@emotion/react';
import { Link, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useEffect } from 'react';
import { useTranslate } from '../i18n/I18NContext';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { useAnnotationContext } from './AnnotationContext';

export const OpenHistoryButton = () => {
    const { translate } = useTranslate();
    const theme = useTheme();
    const { openHistoryModal, loadAnnotations, data, isLoading, error, field } =
        useAnnotationContext();

    useEffect(() => {
        loadAnnotations();
    }, [loadAnnotations]);

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
                                openHistoryModal();
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
        </>
    );
};

OpenHistoryButton.propTypes = {
    field: PropTypes.object.isRequired,
    resourceUri: PropTypes.string,
};
