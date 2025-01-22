import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import { Link, Stack, Tooltip, Typography } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

export const ResourceCell = ({ resource }) => {
    const { translate } = useTranslate();
    if (!resource) {
        return <>{translate('annotation.resource_not_found')}</>;
    }

    return (
        <Stack direction="row" gap={2} sx={{ width: '100%' }}>
            <Tooltip title={resource.title}>
                <Typography
                    sx={{
                        textOverflow: 'ellipsis',
                        overflow: 'hidden',
                    }}
                >
                    {resource.title}
                </Typography>
            </Tooltip>
            <Link href={`/instance/${tenant}/${resource.uri}`} target="_blank">
                <OpenInNewIcon />
            </Link>
        </Stack>
    );
};

ResourceCell.propTypes = {
    resource: PropTypes.shape({
        title: PropTypes.string.isRequired,
        uri: PropTypes.string.isRequired,
    }),
};
