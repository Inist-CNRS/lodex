import { Tooltip, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import { getResourceType } from './helpers/resourceType';

function ResourceTitleCellInternal({ label, italic }) {
    return (
        <Tooltip title={label}>
            <Typography
                sx={{
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    fontStyle: italic ? 'italic' : undefined,
                }}
            >
                {label}
            </Typography>
        </Tooltip>
    );
}

ResourceTitleCellInternal.propTypes = {
    label: PropTypes.string.isRequired,
    italic: PropTypes.bool,
};

export const ResourceTitleCell = ({ row }) => {
    const { translate } = useTranslate();

    if (
        ['home', 'graph'].includes(getResourceType(row.resourceUri, row.field))
    ) {
        return null;
    }

    if (!row.resource) {
        return (
            <ResourceTitleCellInternal
                label={translate('annotation_resource_not_found')}
                italic
            />
        );
    }

    return <ResourceTitleCellInternal label={row.resource.title} />;
};

ResourceTitleCell.propTypes = {
    row: PropTypes.shape({
        resourceUri: PropTypes.string,
        resource: PropTypes.shape({
            title: PropTypes.string.isRequired,
        }),
        field: PropTypes.shape({
            label: PropTypes.string.isRequired,
            scope: PropTypes.string.isRequired,
        }),
    }),
};
