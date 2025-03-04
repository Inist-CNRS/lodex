import AttributionIcon from '@mui/icons-material/Attribution';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
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
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
} from '../../../common/validator/annotation.validator';
import { AnnotationStatus } from '../admin/annotations/AnnotationStatus';
import { AnnotationValue } from '../admin/annotations/AnnotationValue';
import { getResourceType } from '../admin/annotations/helpers/resourceType';
import { useTranslate } from '../i18n/I18NContext';
import { MODE_ALL, MODE_CLOSED, MODE_MINE, MODES } from './HistoryDrawer.const';

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

    const resourceType = getResourceType(
        annotation.resourceUri,
        annotation.field,
    );

    if (resourceType === 'graph') {
        return translate('annotation_graph_page');
    }

    if (resourceType === 'home') {
        return translate('annotation_home_page');
    }

    if (!annotation.resource) {
        return translate('annotation_resource_not_found');
    }

    return annotation.resource.title;
};

export const AnnotationList = ({ mode, setMode, annotations, field }) => {
    const { translate } = useTranslate();
    const theme = useTheme();

    const myAnnotations = useMemo(() => {
        return annotations.filter((annotation) => annotation.isMine);
    }, [annotations]);

    if (mode === MODE_CLOSED) {
        return null;
    }

    return (
        <Stack
            gap={2}
            sx={{
                padding: theme.spacing(2),
                paddingTop: 0,
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
            <Stack direction="row" gap={1} alignItems="center">
                <Typography>
                    {translate('annotation_filter_by_sender')}
                </Typography>
                <ButtonGroup>
                    <Button
                        onClick={() => setMode(MODE_ALL)}
                        variant={mode === MODE_ALL ? 'contained' : 'outlined'}
                    >
                        {translate('all_annotation', {
                            smart_count: annotations.length,
                        })}
                    </Button>
                    <Button
                        onClick={() => {
                            setMode(MODE_MINE);
                        }}
                        startIcon={<AttributionIcon />}
                        variant={mode === MODE_MINE ? 'contained' : 'outlined'}
                        disabled={myAnnotations.length === 0}
                    >
                        {translate('annotation_sent_by_me', {
                            smart_count: myAnnotations.length,
                        })}
                    </Button>
                </ButtonGroup>
            </Stack>
            <Box>
                {(mode === MODE_ALL ? annotations : myAnnotations).map(
                    (annotation) => (
                        <Accordion
                            key={annotation._id}
                            defaultExpanded={
                                mode === MODE_ALL
                                    ? annotations.length === 1
                                    : myAnnotations.length === 1
                            }
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container columns={12}>
                                    <Grid
                                        item
                                        xs={2}
                                        alignItems="center"
                                        display="flex"
                                    >
                                        <Typography
                                            aria-label={translate(
                                                'annotation_kind',
                                            )}
                                        >
                                            {translate(annotation.kind)}
                                        </Typography>
                                    </Grid>
                                    <Grid
                                        item
                                        xs={myAnnotations.length > 0 ? 7 : 8}
                                        alignItems="center"
                                        display="flex"
                                    >
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

                                    {myAnnotations.length > 0 && (
                                        <Grid
                                            item
                                            xs={1}
                                            alignItems="center"
                                            display="flex"
                                        >
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
                                        </Grid>
                                    )}
                                    <Grid
                                        item
                                        xs={2}
                                        alignItems="center"
                                        display="flex"
                                    >
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
                                            <AttributionIcon />
                                            <Typography>
                                                {translate('own_annotation')}
                                            </Typography>
                                        </Stack>
                                    )}
                                    {annotation.initialValue && (
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
                                    )}
                                    {annotation.proposedValue?.length && (
                                        <Box>
                                            <Typography
                                                variant="h6"
                                                id="annotation_proposed_value"
                                            >
                                                {translate(
                                                    'annotation_proposed_value',
                                                    {
                                                        smart_count:
                                                            Array.isArray(
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
                                    )}
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
                                    {annotation.adminComment && (
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
                                    )}
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
    mode: PropTypes.oneOf(MODES).isRequired,
    setMode: PropTypes.func.isRequired,
};
