import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useMemo } from 'react';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
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

interface AnnotationHeaderProps {
    annotation?: object;
}

export function AnnotationHeader({ annotation }: AnnotationHeaderProps) {
    const { translate } = useTranslate();

    const subtitle = useMemo(() => {
        const resourceType = getResourceType(
            // @ts-expect-error TS18048
            annotation.resourceUri,
            // @ts-expect-error TS18048
            annotation.field,
        );

        if (resourceType === 'graph') {
            // @ts-expect-error TS18048
            return annotation.field.label;
        }

        if (resourceType === 'home') {
            return '';
        }

        return (
            // @ts-expect-error TS18048
            annotation.resource?.title ??
            translate('annotation_resource_not_found')
        );
    }, [translate, annotation]);

    return (
        <Stack gap={1}>
            <Stack direction="row" gap={1} alignItems="center">
                <Typography variant="h1" fontSize={24} fontWeight={700}>
                    {/*
                     // @ts-expect-error TS18048 */}
                    {translate(`annotation_header_${annotation.kind}`)}{' '}
                    {/*
                     // @ts-expect-error TS2345 */}
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
