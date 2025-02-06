import SaveIcon from '@mui/icons-material/SaveOutlined';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import { useForm } from '@tanstack/react-form';
import PropTypes from 'prop-types';
import React from 'react';

import { annotationUpdateSchema } from '../../../../../common/validator/annotation.validator';
import { useTranslate } from '../../../i18n/I18NContext';
import { useUpdateAnnotation } from '../hooks/useUpdateAnnotation';
import { AnnotationHeader } from './AnnotationHeader';
import { AnnotationInputs } from './AnnotationInputs';
import { AnnotationItems } from './AnnotationItems';

export const AnnotationForm = ({ annotation }) => {
    const { translate } = useTranslate();

    const { handleUpdateAnnotation, isSubmitting } = useUpdateAnnotation();

    const form = useForm({
        defaultValues: {
            status: annotation.status ?? 'to_review',
            internalComment: annotation.internalComment ?? '',
            administrator: annotation.administrator ?? '',
        },
        onSubmit: async ({ value }) => {
            await handleUpdateAnnotation(annotation._id, value);
        },
        validators: {
            onChange: annotationUpdateSchema,
        },
    });

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
                    <AnnotationInputs form={form} />
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
                    <Button
                        type="button"
                        color="warning"
                        variant="contained"
                        disabled={isSubmitting}
                    >
                        {translate('delete')}
                    </Button>
                    <Stack direction="row" gap={1}>
                        <Button type="button" disabled={isSubmitting}>
                            {translate('cancel')}
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            variant="contained"
                            startIcon={<SaveIcon />}
                            disabled={isSubmitting}
                        >
                            {translate('save')}
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Stack>
    );
};

AnnotationForm.propTypes = {
    annotation: PropTypes.object.isRequired,
    children: PropTypes.node,
};
