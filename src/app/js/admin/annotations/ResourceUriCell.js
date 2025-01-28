import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link, Stack, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

export function ResourceUriCell({ row }) {
    const { translate } = useTranslate();

    if (!row.resourceUri) {
        return (
            <Stack
                gap={1}
                direction="row"
                sx={{
                    alignItems: 'center',
                }}
            >
                <Typography
                    sx={{
                        textDecoration: 'italic',
                    }}
                >
                    {translate('annotation_home_page')}
                </Typography>

                <Link
                    title={translate('annotation_home_page')}
                    href={`/instance/${tenant}`}
                    target="_blank"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <OpenInNewIcon fontSize="1.25rem" />
                </Link>
            </Stack>
        );
    }

    return (
        <Stack
            gap={1}
            direction="row"
            sx={{
                alignItems: 'center',
            }}
        >
            <Typography
                sx={{
                    color: row.resource ? 'text.primary' : 'text.secondary',
                }}
            >
                {row.resourceUri}
            </Typography>

            {row.resource && (
                <Link
                    title={translate('annotation_resource_link')}
                    href={`/instance/${tenant}/${row.resourceUri}`}
                    target="_blank"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                >
                    <OpenInNewIcon fontSize="1.25rem" />
                </Link>
            )}
        </Stack>
    );
}

ResourceUriCell.propTypes = {
    row: PropTypes.shape({
        resourceUri: PropTypes.string,
        resource: PropTypes.shape({
            title: PropTypes.string.isRequired,
        }),
    }),
};
