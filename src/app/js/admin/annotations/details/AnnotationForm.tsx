import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useForm, useStore } from '@tanstack/react-form';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

import { Tooltip } from '@mui/material';
import { DEFAULT_TENANT } from '../../../../../common/tools/tenantTools';
import { annotationUpdateSchema } from '../../../../../common/validator/annotation.validator';
import { useTranslate } from '../../../i18n/I18NContext';
import { SaveButton } from '../../../lib/components/SaveButton';
import { getRedirectFieldHash } from '../helpers/field';
import { getResourceType } from '../helpers/resourceType';
import { useUpdateAnnotation } from '../hooks/useUpdateAnnotation';
import { AnnotationDeleteButton } from './AnnotationDeleteButton';
import { AnnotationHeader } from './AnnotationHeader';
import { AnnotationInputs } from './AnnotationInputs';
import { AnnotationItems } from './AnnotationItems';

interface AnnotationFormProps {
    annotation: object;
    children?: React.ReactNode;
}

export const AnnotationForm = ({ annotation }: AnnotationFormProps) => {
    const tenant = sessionStorage.getItem('lodex-tenant') || DEFAULT_TENANT;

    const { translate } = useTranslate();

    const { handleUpdateAnnotation, isSubmitting } = useUpdateAnnotation();

    const { resourceType, frontUrl, adminUrl } = useMemo(() => {
        const resourceType = getResourceType(
            // @ts-expect-error TS2339
            annotation.resourceUri,
            // @ts-expect-error TS2339
            annotation.field,
        );

        // @ts-expect-error TS2339
        const redirectFieldHash = getRedirectFieldHash(annotation.field);

        if (resourceType === 'graph') {
            return {
                resourceType,
                // @ts-expect-error TS2339
                frontUrl: annotation.resourceUri
                    ? // @ts-expect-error TS2339
                      `/instance/${tenant}${annotation.resourceUri}`
                    : // @ts-expect-error TS2339
                      `/instance/${tenant}/graph/${annotation.field.name}`,
            };
        }

        if (resourceType === 'home') {
            return {
                resourceType,
                frontUrl: `/instance/${tenant}${redirectFieldHash}`,
            };
        }

        return {
            resourceType,
            // @ts-expect-error TS2339
            frontUrl: annotation.resource
                ? // @ts-expect-error TS2339
                  `/instance/${tenant}/${annotation.resourceUri}${redirectFieldHash}`
                : null,
            // @ts-expect-error TS2339
            adminUrl: annotation.resource
                ? // @ts-expect-error TS2339
                  `/instance/${tenant}/admin#/data/existing?uri=${encodeURIComponent(annotation.resourceUri)}`
                : null,
        };
    }, [annotation]);

    const form = useForm({
        defaultValues: {
            // @ts-expect-error TS2339
            status: annotation.status ?? 'to_review',
            // @ts-expect-error TS2339
            internalComment: annotation.internalComment ?? '',
            // @ts-expect-error TS2339
            adminComment: annotation.adminComment ?? '',
            // @ts-expect-error TS2339
            administrator: annotation.administrator ?? '',
        },
        onSubmit: async ({ value }) => {
            // @ts-expect-error TS2339
            await handleUpdateAnnotation(annotation._id, value);
        },
        validators: {
            onChange: annotationUpdateSchema,
        },
    });

    const isFormModified = useStore(form.store, (state) => state.isDirty);

    return (
        <Stack
            gap={4}
            sx={{
                height: '100%',
                paddingBlockStart: '12px',
                paddingBlockEnd: '96px',
            }}
            component="form"
            onSubmit={(event) => {
                event.preventDefault();
                event.stopPropagation();

                form.handleSubmit();
            }}
        >
            <AnnotationHeader annotation={annotation} />
            <Grid
                container
                spacing={2}
                sx={{
                    flexGrow: 1,
                }}
            >
                <Grid
                    item
                    xs={12}
                    lg={6}
                    sx={{
                        flexGrow: 1,
                        paddingInlineEnd: 2,
                    }}
                >
                    {/*
                     // @ts-expect-error TS2740 */}
                    <AnnotationItems annotation={annotation} />
                </Grid>

                <Grid
                    item
                    xs={12}
                    lg={6}
                    sx={{
                        flexGrow: 1,
                        borderLeftStyle: 'solid',
                        borderLeftWidth: '1px',
                        borderLeftColor: 'text.secondary',
                    }}
                >
                    <Stack gap={4}>
                        <Stack direction="row" gap={2}>
                            <Tooltip
                                title={translate(
                                    'annotation_resource_not_found',
                                )}
                                open={frontUrl ? false : undefined}
                            >
                                <span>
                                    <Button
                                        variant="outlined"
                                        // @ts-expect-error TS2769
                                        href={frontUrl}
                                        target="_blank"
                                        disabled={!frontUrl}
                                        sx={{
                                            '&:hover': {
                                                color: 'primary.main',
                                            },
                                        }}
                                    >
                                        {translate(
                                            `annotation_see_${resourceType}`,
                                        )}
                                    </Button>
                                </span>
                            </Tooltip>

                            {adminUrl && (
                                <Button
                                    variant="outlined"
                                    href={adminUrl}
                                    target="_blank"
                                    sx={{
                                        '&:hover': {
                                            color: 'primary.main',
                                        },
                                    }}
                                >
                                    {translate('annotation_update_resource')}
                                </Button>
                            )}
                        </Stack>
                        <AnnotationInputs form={form} />
                    </Stack>
                </Grid>
            </Grid>
            <Box
                sx={{
                    position: 'fixed',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: 'white',
                    boxShadow: '-3px -12px 15px -3px rgba(0,0,0,0.1)',
                    padding: '1rem',
                    zIndex: 999,
                }}
                className="mui-fixed"
            >
                <Stack direction="row" justifyContent="space-between">
                    <AnnotationDeleteButton
                        // @ts-expect-error TS2339
                        id={annotation._id}
                        isSubmitting={isSubmitting}
                    />
                    <Stack direction="row" gap={1}>
                        <Button
                            type="button"
                            disabled={isSubmitting}
                            component={Link}
                            to="/annotations"
                        >
                            {translate('cancel')}
                        </Button>
                        <SaveButton
                            type="submit"
                            disabled={isSubmitting}
                            isFormModified={isFormModified}
                        />
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    );
};
