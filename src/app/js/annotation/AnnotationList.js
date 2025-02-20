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
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '../../../common/validator/annotation.validator';
import AttributionIcon from '@mui/icons-material/Attribution';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export const getAnnotationSummaryValue = (annotation) => {
    switch (annotation.kind) {
        case ANNOTATION_KIND_COMMENT:
            return annotation.comment;
        case ANNOTATION_KIND_CORRECTION:
            return `${annotation.initialValue} -> ${annotation.proposedValue}`;
        case ANNOTATION_KIND_REMOVAL:
            return annotation.initialValue;
        case ANNOTATION_KIND_ADDITION:
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
                            <Grid container columns={12} gap={2}>
                                <Grid item xs={2}>
                                    <Typography
                                        aria-label={translate(
                                            'annotation_kind',
                                        )}
                                    >
                                        {annotation.kind}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
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
                                <Grid item xs={2}>
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
                                <Grid item xs={1}>
                                    {annotation.isMine && (
                                        <Tooltip
                                            aria-label={translate(
                                                'own_annotation',
                                            )}
                                            title={translate('own_annotation')}
                                        >
                                            <AttributionIcon />
                                        </Tooltip>
                                    )}
                                </Grid>
                            </Grid>
                        </AccordionSummary>
                        <AccordionDetails>
                            <Stack gap={2}>
                                {annotation.isMine && (
                                    <Stack
                                        direction="row"
                                        gap={1}
                                        sx={{
                                            border: '1px solid',
                                            borderColor:
                                                theme.palette.primary.main,
                                            padding: '5px',
                                            color: theme.palette.primary.main,
                                        }}
                                    >
                                        <InfoOutlinedIcon />
                                        <Typography>
                                            {translate('own_annotation')}
                                        </Typography>
                                    </Stack>
                                )}
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
