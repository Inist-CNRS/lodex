import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    ButtonGroup,
    Grid,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import React, { useMemo } from 'react';
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
        case ANNOTATION_KIND_CORRECTION: {
            const initialValue = annotation.initialValue
                .toString()
                .replace(/<[^>]*>/g, '');
            const truncatedInitialValue =
                initialValue.length > 16
                    ? `${initialValue.slice(0, 16)} ...`
                    : initialValue;
            const proposedValue = Array.isArray(annotation.proposedValue)
                ? annotation.proposedValue.join(' ')
                : annotation.proposedValue.toString();
            const truncatedProposedValue =
                proposedValue.length > 16
                    ? `${proposedValue.slice(0, 16)} ...`
                    : proposedValue;
            return `${truncatedInitialValue} -> ${truncatedProposedValue}`;
        }
        case ANNOTATION_KIND_REMOVAL:
            if (Array.isArray(annotation.initialValue)) {
                return annotation.initialValue.join(' ');
            }
            return annotation.initialValue.toString().replace(/<[^>]*>/g, '');
        case ANNOTATION_KIND_ADDITION:
            return Array.isArray(annotation.proposedValue)
                ? annotation.proposedValue.join(' ')
                : annotation.proposedValue;
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
    const [mode, setMode] = React.useState('all');

    const myAnnotations = useMemo(() => {
        return annotations.filter((annotation) => annotation.isMine);
    }, [annotations]);

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
            <ButtonGroup>
                <Button
                    onClick={() => setMode('all')}
                    variant={mode === 'all' ? 'contained' : 'outlined'}
                >
                    {translate('all_annotation')}
                </Button>
                <Button
                    onClick={() => {
                        setMode('mine');
                    }}
                    endIcon={<AttributionIcon />}
                    variant={mode === 'mine' ? 'contained' : 'outlined'}
                    disabled={myAnnotations.length === 0}
                >
                    {translate('annotation_sent_by_me')}
                </Button>
            </ButtonGroup>
            <Box>
                {(mode === 'all' ? annotations : myAnnotations).map(
                    (annotation) => (
                        <Accordion
                            key={annotation._id}
                            defaultExpanded={
                                mode === 'all'
                                    ? annotations.length === 1
                                    : myAnnotations.length === 1
                            }
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container columns={12}>
                                    <Grid item xs={2}>
                                        <Typography
                                            aria-label={translate(
                                                'annotation_kind',
                                            )}
                                        >
                                            {annotation.kind}
                                        </Typography>
                                    </Grid>
                                    <Grid item xs={8}>
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
                                                    width: '100%',
                                                }}
                                                aria-label={translate(
                                                    'annotation_summary_value',
                                                )}
                                            >
                                                {getAnnotationSummaryValue(
                                                    annotation,
                                                ).slice(0, 50)}
                                            </Typography>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item xs={2}>
                                        <AnnotationStatus
                                            arialLabel={translate(
                                                'annotation_status',
                                            )}
                                            status={
                                                annotation.status ===
                                                'to_review'
                                                    ? 'ongoing'
                                                    : annotation.status
                                            }
                                        />
                                    </Grid>
                                </Grid>
                                {myAnnotations.length > 0 && (
                                    <Box sx={{ width: '2em' }}>
                                        {annotation.isMine && (
                                            <Tooltip
                                                aria-label={translate(
                                                    'own_annotation',
                                                )}
                                                title={translate(
                                                    'own_annotation',
                                                )}
                                            >
                                                <AttributionIcon />
                                            </Tooltip>
                                        )}
                                    </Box>
                                )}
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
                                                color: theme.palette.primary
                                                    .main,
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
                                            {translate(
                                                'annotation_initial_value',
                                            )}
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
                                            {translate(
                                                'annotation_proposed_value',
                                                {
                                                    smart_count: Array.isArray(
                                                        annotation.proposedValue,
                                                    )
                                                        ? annotation
                                                              .proposedValue
                                                              .length
                                                        : 1,
                                                },
                                            )}
                                        </Typography>
                                        <Typography aria-labelledby="annotation_proposed_value">
                                            {Array.isArray(
                                                annotation.proposedValue,
                                            )
                                                ? annotation.proposedValue.map(
                                                      (value) => (
                                                          <Typography
                                                              key={value}
                                                          >
                                                              {value}
                                                          </Typography>
                                                      ),
                                                  )
                                                : annotation.proposedValue}
                                        </Typography>
                                    </Box>
                                    <Box>
                                        <Typography
                                            variant="h6"
                                            id="annotation_comment_section"
                                            component="pre"
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
                                        <Typography
                                            variant="h6"
                                            id="annotation_admin_comment_section"
                                        >
                                            {translate(
                                                'annotation_admin_comment_section',
                                            )}
                                        </Typography>
                                        <Typography
                                            component="pre"
                                            aria-labelledby="annotation_admin_comment_section"
                                        >
                                            {annotation.adminComment}
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
                    ),
                )}
            </Box>
        </Stack>
    );
};

AnnotationList.propTypes = {
    annotations: PropTypes.array.isRequired,
    field: PropTypes.object.isRequired,
};
