import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Link, Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import { useTranslate } from '../../i18n/I18NContext';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

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
            <Tooltip title={label}>
                <Typography
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
            </Tooltip>

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

export function ResourceUriCell({ row }) {
    const { translate } = useTranslate();

    if (row.field?.scope === 'graphic') {
        return (
            <ResourceUriCellInternal
                label={translate('annotation_graph_page')}
                linkUrl={`/instance/${tenant}/graph/${row.field.name}`}
                italic
            />
        );
    }

    if (!row.resourceUri) {
        return (
            <ResourceUriCellInternal
                label={translate('annotation_home_page')}
                linkUrl={`/instance/${tenant}`}
                italic
            />
        );
    }

    return (
        <ResourceUriCellInternal
            label={row.resourceUri}
            linkUrl={
                row.resource ? `/instance/${tenant}/${row.resourceUri}` : null
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
