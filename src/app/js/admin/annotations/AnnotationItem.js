import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Grid, Link, Stack, Typography } from '@mui/material';
import React from 'react';
import { Redirect } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import Loading from '../../lib/components/Loading';
import { useGetAnnotation } from './useGetAnnotation';
import { AnnotationForm } from './AnnotationForm';
import { AnnotationValue } from './AnnotationValue';

const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

const getAnnotationResourceTitle = (annotation, translate) => {
    if (!annotation.resourceUri) {
        return translate('annotation_home_page');
    }

    if (!annotation.resource) {
        return translate('annotation_resource_not_found');
    }

    return annotation.resource.title;
};

export const AnnotationItem = () => {
    const match = useRouteMatch();
    const { translate } = useTranslate();
    const {
        data: annotation,
        error,
        isLoading,
    } = useGetAnnotation(match.params.annotationId);

    if (isLoading) {
        return <Loading>{translate('loading')}</Loading>;
    }

    if (error) {
        console.error(error);
        return (
            <AdminOnlyAlert>
                {translate('annotation_query_error')}
            </AdminOnlyAlert>
        );
    }

    if (!annotation) {
        return <Redirect to="/annotations" />;
    }

    return (
        <Stack gap={3}>
            <Stack gap={1}>
                <Typography variant="h4">
                    {translate('annotation_header')}{' '}
                    {getAnnotationResourceTitle(annotation, translate)}
                </Typography>
                {annotation.resourceUri ? (
                    <Stack direction="row">
                        <Typography>{annotation.resourceUri}</Typography>
                        {annotation.resource && (
                            <Link
                                title={translate('annotation_resource_link')}
                                href={`/instance/${tenant}/${annotation.resourceUri}`}
                                target="_blank"
                            >
                                <OpenInNewIcon />
                            </Link>
                        )}
                    </Stack>
                ) : (
                    <Stack direction="row">
                        <Typography>/</Typography>
                        <Link
                            title={translate('annotation_resource_link')}
                            href={`/instance/${tenant}`}
                            target="_blank"
                        >
                            <OpenInNewIcon />
                        </Link>
                    </Stack>
                )}
            </Stack>
            <Grid container columns={3}>
                <Grid item xs={2}>
                    <Stack gap={3}>
                        <Stack gap={2}>
                            <Typography variant="h6">
                                {translate('annotation_field_section')}
                            </Typography>
                            {annotation.field ? (
                                <Grid container columns={2} spacing={2}>
                                    <AnnotationValue
                                        label="annotation_field_label"
                                        value={annotation.field.label}
                                    />
                                    <AnnotationValue
                                        label="annotation_field_name"
                                        value={`[${annotation.field.name}]`}
                                    />
                                    <AnnotationValue
                                        label="annotation_field_internal_name"
                                        value={annotation.field.internalName}
                                    />
                                    <AnnotationValue
                                        label="annotation_field_internal_scopes"
                                        value={(
                                            annotation.field.internalScopes ||
                                            []
                                        ).map((scope) => (
                                            <FieldInternalIcon
                                                key={scope}
                                                scope={scope}
                                                p={{ t: translate }}
                                            />
                                        ))}
                                    />
                                    <AnnotationValue
                                        label="annotation_initialValue"
                                        value={annotation.initialValue}
                                    />
                                </Grid>
                            ) : (
                                translate('annotation_field_not_found')
                            )}
                        </Stack>

                        <Stack gap={2}>
                            <Typography
                                variant="h6"
                                id="annotation_comment_section"
                            >
                                {translate('annotation_comment_section')}
                            </Typography>
                            <Typography aria-labelledby="annotation_comment_section">
                                {annotation.comment}
                            </Typography>
                        </Stack>

                        <Stack gap={2}>
                            <Typography variant="h6">
                                {translate('annotation_contributor_section')}
                            </Typography>
                            <Grid container spacing={2} columns={2}>
                                <AnnotationValue
                                    label="annotation_author_name"
                                    value={annotation.authorName}
                                />
                                <AnnotationValue
                                    label="annotation_author_email"
                                    value={annotation.authorEmail}
                                />
                            </Grid>
                        </Stack>

                        <Stack gap={2}>
                            <Typography variant="h6">
                                {translate(
                                    'annotation_complementary_infos_section',
                                )}
                            </Typography>
                            <Grid container spacing={2} columns={2}>
                                <AnnotationValue
                                    label="annotation_created_at"
                                    value={new Date(
                                        annotation.createdAt,
                                    ).toLocaleDateString()}
                                />
                                <AnnotationValue
                                    label="annotation_updated_at"
                                    value={new Date(
                                        annotation.updatedAt,
                                    ).toLocaleDateString()}
                                />
                            </Grid>
                        </Stack>
                    </Stack>
                </Grid>
                <Grid
                    item
                    xs={1}
                    sx={{
                        borderLeft: '1px solid grey',
                        padding: '1em',
                    }}
                >
                    <AnnotationForm annotation={annotation} />
                </Grid>
            </Grid>
        </Stack>
    );
};
