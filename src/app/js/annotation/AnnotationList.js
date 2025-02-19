import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Grid,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React from 'react';
import { AnnotationStatus } from '../admin/annotations/AnnotationStatus';
import { useTranslate } from '../i18n/I18NContext';
import { AnnotationValue } from '../admin/annotations/AnnotationValue';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';

export const getAnnotationSummaryValue = (annotation) => {
    switch (annotation.kind) {
        case 'comment':
            return annotation.comment;
        case 'correction':
            return `${annotation.initialValue} -> ${annotation.proposedValue}`;
        case 'removal':
            return annotation.initialValue;
        case 'addition':
            return annotation.proposedValue;
        default:
            return '';
    }
};

export const getAnnotationTitle = (annotation, translate) => {
    if (!annotation) {
        return null;
    }

    if (annotation.field?.scope === 'graphic') {
        return translate('annotation_graph_page');
    }
    if (!annotation.resourceUri) {
        return translate('annotation_home_page');
    }

    if (!annotation.resource) {
        return translate('annotation_resource_not_found');
    }

    return annotation.resource.title;
};

export const AnnotationList = ({ annotations, field }) => {
    const { translate } = useTranslate();
    const theme = useTheme();

    return (
        <Stack
            gap={2}
            sx={{
                margin: theme.spacing(1),
                backgroundColor: theme.palette.grey[100],
            }}
        >
            <Stack>
                <Typography variant="h5">
                    {translate('annotation_history', {
                        fieldLabel: field.label,
                    })}
                </Typography>
                <Typography aria-label={translate('annotation_resource')}>
                    {getAnnotationTitle(annotations[0], translate)}
                </Typography>
            </Stack>
            <Box>
                {annotations.map((annotation) => (
                    <Accordion defaultExpanded={annotations.length === 1}>
                        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Grid container columns={8} gap={2}>
                                <Grid item xs={1}>
                                    <Typography
                                        aria-label={translate(
                                            'annotation_kind',
                                        )}
                                    >
                                        {annotation.kind}
                                    </Typography>
                                </Grid>
                                <Grid item xs={5}>
                                    <Tooltip
                                        title={getAnnotationSummaryValue(
                                            annotation,
                                        )}
                                    >
                                        <Typography
                                            sx={{
                                                textOverflow: 'ellipsis',
                                                overflow: 'hidden',
                                                whiteSpace: 'nowrap',
                                            }}
                                            aria-label={translate(
                                                'annotation_summary_value',
                                            )}
                                        >
                                            {getAnnotationSummaryValue(
                                                annotation,
                                            )}
                                        </Typography>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={1}>
                                    <AnnotationStatus
                                        arialLabel={translate(
                                            'annotation_status',
                                        )}
                                        status={
                                            annotation.status === 'to_review'
                                                ? 'ongoing'
                                                : annotation.status
                                        }
                                    />
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack gap={2}>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        id="annotation_initial_value"
                                    >
                                        {translate('annotation_initial_value')}
                                    </Typography>
                                    <Typography aria-labelledby="annotation_initial_value">
                                        {annotation.initialValue}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        id="annotation_proposed_value"
                                    >
                                        {translate('annotation_proposed_value')}
                                    </Typography>
                                    <Typography aria-labelledby="annotation_proposed_value">
                                        {annotation.proposedValue}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography
                                        variant="h6"
                                        id="annotation_comment_section"
                                    >
                                        {translate(
                                            'annotation_comment_section',
                                        )}
                                    </Typography>
                                    <Typography aria-labelledby="annotation_comment_section">
                                        {annotation.comment}
                                    </Typography>
                                </Box>
                                <Box>
                                    <Typography variant="h6">
                                        {translate(
                                            'annotation_complementary_infos_section',
                                        )}
                                    </Typography>
                                    <Grid container columns={2}>
                                        <AnnotationValue
                                            label="annotation_updated_at"
                                            value={new Date(
                                                annotation.updatedAt,
                                            ).toLocaleDateString()}
                                        />
                                        <AnnotationValue
                                            label="annotation_created_at"
                                            value={new Date(
                                                annotation.createdAt,
                                            ).toLocaleDateString()}
                                        />
                                    </Grid>
                                </Box>
                            </Stack>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </Stack>
    );
};

AnnotationList.propTypes = {
    annotations: PropTypes.array.isRequired,
    field: PropTypes.object.isRequired,
};
