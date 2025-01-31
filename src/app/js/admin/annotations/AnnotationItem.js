import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Grid, Link, Stack, Typography, useTheme } from '@mui/material';
import React from 'react';
import { Redirect } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { DEFAULT_TENANT } from '../../../../common/tools/tenantTools';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import Loading from '../../lib/components/Loading';
import { useGetAnnotation } from './useGetAnnotation';

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
    const theme = useTheme();

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

            <Stack gap={2}>
                <Typography variant="h6">
                    {translate('annotation_field_section')}
                </Typography>
                {annotation.field ? (
                    <Grid container columns={2} spacing={2}>
                        <Grid item xs={1}>
                            <Typography
                                sx={{
                                    fontWeight: 800,
                                    color: theme.palette.text.secondary,
                                }}
                                id="annotation_field_label"
                            >
                                {translate('annotation_field_label')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                variant="body1"
                                aria-labelledby="annotation_field_label"
                            >
                                {annotation.field.label}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                id="annotation_field_name"
                                sx={{
                                    fontWeight: 800,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {translate('annotation_field_name')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                variant="body1"
                                aria-labelledby="annotation_field_name"
                            >
                                {annotation.field.name
                                    ? `[${annotation.field.name}]`
                                    : ''}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                id="annotation_field_internal_name"
                                sx={{
                                    fontWeight: 800,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {translate('annotation_field_internal_name')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                variant="body1"
                                aria-labelledby="annotation_field_internal_name"
                            >
                                {annotation.field.internalName}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                id="annotation_field_internal_scopes"
                                sx={{
                                    fontWeight: 800,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {translate('annotation_field_internal_scopes')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                variant="body1"
                                aria-labelledby="annotation_field_internal_scopes"
                            >
                                {(annotation.field.internalScopes || []).map(
                                    (scope) => (
                                        <FieldInternalIcon
                                            key={scope}
                                            scope={scope}
                                            p={{ t: translate }}
                                        />
                                    ),
                                )}
                            </Typography>
                        </Grid>

                        <Grid item xs={1}>
                            <Typography
                                id="annotation_initialValue"
                                sx={{
                                    fontWeight: 800,
                                    color: theme.palette.text.secondary,
                                }}
                            >
                                {translate('annotation_initialValue')}
                            </Typography>
                        </Grid>
                        <Grid item xs={1}>
                            <Typography
                                variant="body1"
                                aria-labelledby="annotation_initialValue"
                            >
                                {annotation.initialValue}
                            </Typography>
                        </Grid>
                    </Grid>
                ) : (
                    translate('annotation_field_not_found')
                )}
            </Stack>

            <Stack gap={2}>
                <Typography variant="h6" id="annotation_comment_section">
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
                    <Grid item xs={1}>
                        <Typography
                            id="annotation_field_author_name"
                            sx={{
                                fontWeight: 800,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {translate('annotation_field_author_name')}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography
                            variant="body1"
                            aria-labelledby="annotation_field_author_name"
                        >
                            {annotation.authorName}
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={2} columns={2}>
                    <Grid item xs={1}>
                        <Typography
                            id="annotation_field_author_email"
                            sx={{
                                fontWeight: 800,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {translate('annotation_field_author_email')}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography
                            variant="body1"
                            aria-labelledby="annotation_field_author_email"
                        >
                            {annotation.authorEmail}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>

            <Stack gap={2}>
                <Typography variant="h6">
                    {translate('annotation_complementary_infos_section')}
                </Typography>
                <Grid container spacing={2} columns={2}>
                    <Grid item xs={1}>
                        <Typography
                            id="annotation_created_at"
                            sx={{
                                fontWeight: 800,
                                color: theme.palette.text.secondary,
                            }}
                        >
                            {translate('annotation_created_at')}
                        </Typography>
                    </Grid>
                    <Grid item xs={1}>
                        <Typography
                            variant="body1"
                            aria-labelledby="annotation_created_at"
                        >
                            {new Date(
                                annotation.createdAt,
                            ).toLocaleDateString()}
                        </Typography>
                    </Grid>
                </Grid>
            </Stack>
        </Stack>
    );
};
