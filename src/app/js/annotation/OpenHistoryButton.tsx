import { useTheme } from '@emotion/react';
import { Link, Stack, Typography } from '@mui/material';

import { useTranslate } from '../i18n/I18NContext';
import AdminOnlyAlert from '../lib/components/AdminOnlyAlert';
import { useGetFieldAnnotation } from './useGetFieldAnnotation';

interface OpenHistoryButtonProps {
    field: {
        _id: string;
    };
    resourceUri?: string;
    openHistory(...args: unknown[]): unknown;
}

export const OpenHistoryButton = ({
    field,
    resourceUri,
    openHistory,
}: OpenHistoryButtonProps) => {
    const { translate } = useTranslate();
    const theme = useTheme();

    const { data, isLoading, error } = useGetFieldAnnotation(
        field._id,
        resourceUri,
    );

    return (
        // @ts-expect-error TS2339
        <Stack
            gap={0.5}
            paddingBlockEnd={2}
            borderBottom={1}
            // @ts-expect-error TS2339
            borderColor={theme.palette.grey[500]}
        >
            <>
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1rem',
                    }}
                >
                    {translate('annotation_history')}
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
                                // @ts-expect-error TS2339
                                color: theme.palette.primary.main,
                                fontSize: '1rem',
                                '&:hover': {
                                    // @ts-expect-error TS2339
                                    color: theme.palette.primary.main,
                                    textDecoration: 'none',
                                },
                            }}
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                openHistory();
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
            </>
        </Stack>
    );
};
