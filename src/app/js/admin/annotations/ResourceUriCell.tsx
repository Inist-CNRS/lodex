import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';
import { getRedirectFieldHash } from './helpers/field';
import { getResourceType } from './helpers/resourceType';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

// @ts-expect-error TS7031
function ResourceUriCellInternal({ label, linkLabel, linkUrl, italic, color }) {
    return (
        <Box
            gap={1}
            sx={{
                display: 'grid',
                gridTemplateColumns: '1fr auto',
                alignItems: 'center',
            }}
        >
            <Typography
                title={label}
                sx={{
                    fontStyle: italic ? 'italic' : undefined,
                    color: color ?? 'text.primary',
                    display: 'block',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                }}
            >
                {label}
            </Typography>

            {!!linkUrl && (
                <Link
                    title={linkLabel ?? label}
                    href={linkUrl}
                    target="_blank"
                    sx={{
                        alignItems: 'center',
                        display: 'flex',
                    }}
                    onClick={(event) => event.stopPropagation()}
                >
                    {/*
                     // @ts-expect-error TS2769 */}
                    <OpenInNewIcon fontSize="1.25rem" />
                </Link>
            )}
        </Box>
    );
}

ResourceUriCellInternal.propTypes = {
    label: PropTypes.string.isRequired,
    linkUrl: PropTypes.string,
    linkLabel: PropTypes.string,
    italic: PropTypes.bool,
    color: PropTypes.string,
};

// @ts-expect-error TS7031
export function ResourceUriCell({ row }) {
    const { translate } = useTranslate();
    const resourceType = getResourceType(row.resourceUri, row.field);
    const redirectFieldHash = getRedirectFieldHash(row.field);

    if (resourceType === 'graph') {
        return (
            <ResourceUriCellInternal
                label={row.resourceUri ?? `/graph/${row.field.name}`}
                linkUrl={`/instance/${tenant}${row.resourceUri ?? `/graph/${row.field.name}`}`}
            />
        );
    }

    if (resourceType === 'home') {
        return (
            <ResourceUriCellInternal
                label={row.resourceUri ?? '/'}
                linkUrl={`/instance/${tenant}${redirectFieldHash}`}
            />
        );
    }

    return (
        <ResourceUriCellInternal
            label={row.resourceUri}
            linkUrl={
                row.resource
                    ? `/instance/${tenant}/${row.resourceUri}${redirectFieldHash}`
                    : null
            }
            linkLabel={translate('annotation_resource_link')}
            color={row.resource ? 'text.primary' : 'text.secondary'}
        />
    );
}

ResourceUriCell.propTypes = {
    row: PropTypes.shape({
        resourceUri: PropTypes.string,
        resource: PropTypes.shape({
            title: PropTypes.string.isRequired,
        }),
        field: PropTypes.shape({
            name: PropTypes.string.isRequired,
            scope: PropTypes.string.isRequired,
        }),
    }),
};
