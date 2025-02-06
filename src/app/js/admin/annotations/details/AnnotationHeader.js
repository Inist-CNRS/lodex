import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { DEFAULT_TENANT } from '../../../../../common/tools/tenantTools';
import { useTranslate } from '../../../i18n/I18NContext';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

const getAnnotationResourceTitle = (annotation, translate) => {
    if (annotation.field?.scope === 'graphic') {
        return translate('annotation_graph_page');
    }

    if (!annotation.resourceUri) {
        return translate('annotation_home_page');
    }

    return annotation.resourceUri;
};

export function AnnotationHeader({ annotation }) {
    const { translate } = useTranslate();

    const { subtitle, linkUrl } = useMemo(() => {
        if (annotation.field?.scope === 'graphic') {
            return {
                subtitle: annotation.field.label,
                linkUrl: `/instance/${tenant}/graph/${annotation.field.name}`,
            };
        }

        if (annotation.resourceUri) {
            return {
                subtitle:
                    annotation.resource?.title ??
                    translate('annotation_resource_not_found'),
                linkUrl: annotation.resource
                    ? `/instance/${tenant}/${annotation.resourceUri}`
                    : null,
            };
        }

        return {
            subtitle: '',
            linkUrl: `/instance/${tenant}`,
        };
    }, [annotation]);

    return (
        <Stack gap={1}>
            <Stack direction="row" gap={1} alignItems="center">
                <Typography variant="h1" fontSize={24} fontWeight={700}>
                    {translate('annotation_header')}{' '}
                    {getAnnotationResourceTitle(annotation, translate)}
                </Typography>

                {linkUrl && (
                    <IconButton
                        component={Link}
                        title={translate('annotation_resource_link')}
                        href={linkUrl}
                        color="primary"
                        size="small"
                        target="_blank"
                    >
                        <OpenInNewIcon
                            sx={{
                                fontSize: '1.1rem',
                            }}
                        />
                    </IconButton>
                )}
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
