import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import { getResourceType } from './helpers/resourceType';

// @ts-expect-error TS7031
function ResourceTitleCellInternal({ label, italic }) {
    return (
        <Typography
            title={label}
            sx={{
                textOverflow: 'ellipsis',
                overflow: 'hidden',
                fontStyle: italic ? 'italic' : undefined,
            }}
        >
            {label}
        </Typography>
    );
}

ResourceTitleCellInternal.propTypes = {
    label: PropTypes.string.isRequired,
    italic: PropTypes.bool,
};

// @ts-expect-error TS7031
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
