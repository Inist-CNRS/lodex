import { Typography } from '@mui/material';

import { useTranslate } from '../../../../src/app/js/i18n/I18NContext';
import { getResourceType } from './helpers/resourceType';

interface ResourceTitleCellInternalProps {
    label: string;
    italic?: boolean;
}

function ResourceTitleCellInternal({
    label,
    italic,
}: ResourceTitleCellInternalProps) {
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

interface ResourceTitleCellProps {
    row: {
        resourceUri: string;
        resource?: {
            title: string;
        } | null;
        field?: {
            label: string;
            scope: string;
        };
    };
}

export const ResourceTitleCell = ({ row }: ResourceTitleCellProps) => {
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
