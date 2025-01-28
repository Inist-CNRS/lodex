import { Stack, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';

export const ResourceTitleCell = ({ row }) => {
    const { translate } = useTranslate();

    if (!row.resourceUri) {
        return <Typography>{translate('annotation_home_page')}</Typography>;
    }

    if (!row.resource) {
        return (
            <Typography
                sx={{
                    textDecoration: 'italic',
                }}
            >
                {translate('annotation_resource_not_found')}
            </Typography>
        );
    }

    return (
        <Stack direction="row" gap={2} sx={{ width: '100%' }}>
            <Tooltip title={row.resource.title}>
                <Typography
                    sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {row.resource.title}
                </Typography>
            </Tooltip>
        </Stack>
    );
};

ResourceTitleCell.propTypes = {
    row: PropTypes.shape({
        resourceUri: PropTypes.string,
        resource: PropTypes.shape({
            title: PropTypes.string.isRequired,
        }),
    }),
};
