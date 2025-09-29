import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React, { useMemo } from 'react';
import { useTranslate } from '../../../i18n/I18NContext';
import { getResourceType } from '../helpers/resourceType';

// @ts-expect-error TS7031
const getAnnotationResourceTitle = ({ resourceUri, field }, translate) => {
    const resourceType = getResourceType(resourceUri, field);
    if (resourceType === 'graph') {
        return translate('annotation_graph_page');
    }

    if (resourceType === 'home') {
        return translate('annotation_home_page');
    }

    return resourceUri;
};

// @ts-expect-error TS7031
export function AnnotationHeader({ annotation }) {
    const { translate } = useTranslate();

    const subtitle = useMemo(() => {
        const resourceType = getResourceType(
            annotation.resourceUri,
            annotation.field,
        );

        if (resourceType === 'graph') {
            return annotation.field.label;
        }

        if (resourceType === 'home') {
            return '';
        }

        return (
            annotation.resource?.title ??
            translate('annotation_resource_not_found')
        );
    }, [translate, annotation]);

    return (
        <Stack gap={1}>
            <Stack direction="row" gap={1} alignItems="center">
                <Typography variant="h1" fontSize={24} fontWeight={700}>
                    {translate(`annotation_header_${annotation.kind}`)}{' '}
                    {getAnnotationResourceTitle(annotation, translate)}
                </Typography>
            </Stack>

            {subtitle && (
                <Typography color="text.secondary" role="heading">
                    {subtitle}
                </Typography>
            )}
        </Stack>
    );
}

AnnotationHeader.propTypes = {
    annotation: PropTypes.object,
};
