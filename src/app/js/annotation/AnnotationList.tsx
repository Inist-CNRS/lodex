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
    IconButton,
    Stack,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import {
    ANNOTATION_KIND_ADDITION,
    ANNOTATION_KIND_COMMENT,
    ANNOTATION_KIND_CORRECTION,
    ANNOTATION_KIND_REMOVAL,
    type AnnotationStatus,
} from '@lodex/common';
import { AnnotationStatusChip } from '../../../../packages/admin-app/src/annotations/AnnotationStatus';
import { AnnotationValue } from '../../../../packages/admin-app/src/annotations/AnnotationValue';
import { getResourceType } from '../../../../packages/admin-app/src/annotations/helpers/resourceType';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { CloseAllIcon } from './icons/CloseAllIcon';
import { OpenAllIcon } from './icons/OpenAllIcon';
import {
    MODE_ALL,
    MODE_CLOSED,
    MODE_MINE,
    type Mode,
} from './HistoryDrawer.const';
import { sanitize } from '../lib/sanitize';

// @ts-expect-error TS7006
export const getAnnotationSummaryValue = (annotation) => {
    const JOIN_SEPARATOR = ' | ';
    switch (annotation.kind) {
        case ANNOTATION_KIND_COMMENT:
            return annotation.comment;
        case ANNOTATION_KIND_CORRECTION: {
            const initialValue = sanitize(annotation.initialValue, '""');

            const truncatedInitialValue =
                initialValue.length > 16
                    ? `${initialValue.slice(0, 16)} ...`
                    : initialValue;
            const proposedValue = Array.isArray(annotation.proposedValue)
                ? annotation.proposedValue.join(JOIN_SEPARATOR)
                : annotation.proposedValue.toString();
            const truncatedProposedValue =
                proposedValue.length > 16
                    ? `${proposedValue.slice(0, 16)} ...`
                    : proposedValue;
            return `${truncatedInitialValue} -> ${truncatedProposedValue}`;
        }
        case ANNOTATION_KIND_REMOVAL:
            if (Array.isArray(annotation.initialValue)) {
                return (
                    annotation.initialValue
                        // @ts-expect-error TS7006
                        .map((value) =>
                            [null, undefined, ''].includes(value)
                                ? '""'
                                : value,
                        )
                        .join(JOIN_SEPARATOR)
                );
            }
            return sanitize(annotation.initialValue, '""');
        case ANNOTATION_KIND_ADDITION:
            return Array.isArray(annotation.proposedValue)
                ? annotation.proposedValue.join(JOIN_SEPARATOR)
                : annotation.proposedValue;
        default:
            return '';
    }
};

// @ts-expect-error TS7006
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

export type AnnotationListProps = {
    annotations: {
        _id: string;
        isMine: boolean;
        kind: string;
        status: AnnotationStatus;
        initialValue: unknown;
        proposedValue: string;
        authorName: string;
        isContributorNamePublic: boolean;
        comment: string;
        adminComment?: string;
        createdAt: string;
        updatedAt: string;
        resourceUri: string;
        resource?: {
            title: string;
        } | null;
        field: {
            label: string;
            scope: string;
        };
    }[];
    field: {
        label: string;
    };
    mode: Mode;
    setMode(...args: unknown[]): unknown;
};

export const AnnotationList = ({
    mode,
    setMode,
    annotations,
    field,
}: AnnotationListProps) => {
    const { translate } = useTranslate();
    const theme = useTheme();

    const myAnnotations = useMemo(() => {
        return annotations.filter((annotation) => annotation.isMine);
    }, [annotations]);

    const [annotationsOpen, setAnnotationsOpen] = useState<
        Record<string, boolean>
    >(
        annotations.reduce(
            (acc, annotation) => ({
                ...acc,
                [annotation._id]: false,
            }),
            {},
        ),
    );

    const openAllAnnotations = () => {
        setAnnotationsOpen((annotationsOpen) =>
            annotations.reduce(
                (acc, annotation) => ({
                    ...acc,
                    [annotation._id]: true,
                }),
                annotationsOpen,
            ),
        );
    };

    const closeAllAnnotations = () => {
        setAnnotationsOpen((annotationsOpen) =>
            annotations.reduce(
                (acc, annotation) => ({
                    ...acc,
                    [annotation._id]: false,
                }),
                annotationsOpen,
            ),
        );
    };

    useEffect(() => {
        if (mode === MODE_ALL && annotations.length > 0) {
            setAnnotationsOpen((annotationsOpen) => ({
                ...annotationsOpen,
                [annotations[0]._id]: true,
            }));
        }
        if (mode === MODE_MINE && myAnnotations.length > 0) {
            setAnnotationsOpen((annotationsOpen) => ({
                ...annotationsOpen,
                [myAnnotations[0]._id]: true,
            }));
        }
    }, [annotations, mode, myAnnotations]);

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
                    {translate('annotation_history_for_field', {
                        fieldLabel: field.label,
                    })}
                </Typography>
                <Typography aria-label={translate('annotation_resource')}>
                    {getAnnotationTitle(annotations[0], translate)}
                </Typography>
            </Stack>
            <Stack direction="column" gap={1}>
                <Typography component="div">
                    {translate('annotation_filter_by_sender')}
                </Typography>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                >
                    <ButtonGroup>
                        <Button
                            onClick={() => setMode(MODE_ALL)}
                            variant={
                                mode === MODE_ALL ? 'contained' : 'outlined'
                            }
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
                            variant={
                                mode === MODE_MINE ? 'contained' : 'outlined'
                            }
                            disabled={myAnnotations.length === 0}
                        >
                            {translate('annotation_sent_by_me', {
                                smart_count: myAnnotations.length,
                            })}
                        </Button>
                    </ButtonGroup>
                    <Box>
                        <IconButton
                            title={translate('collapse_all_annotations')}
                            aria-label={translate('collapse_all_annotations')}
                            onClick={closeAllAnnotations}
                        >
                            <CloseAllIcon />
                        </IconButton>
                        <IconButton
                            title={translate('expand_all_annotations')}
                            aria-label={translate('expand_all_annotations')}
                            onClick={openAllAnnotations}
                        >
                            <OpenAllIcon />
                        </IconButton>
                    </Box>
                </Stack>
            </Stack>
            <Box>
                {(mode === MODE_ALL ? annotations : myAnnotations).map(
                    (annotation) => (
                        <Accordion
                            key={annotation._id}
                            expanded={annotationsOpen[annotation._id]}
                            onChange={() => {
                                setAnnotationsOpen((annotationsOpen) => ({
                                    ...annotationsOpen,
                                    [annotation._id]:
                                        !annotationsOpen[annotation._id],
                                }));
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Grid container columns={12}>
                                    <Grid
                                        item
                                        xs={3}
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
                                        xs={myAnnotations.length > 0 ? 6 : 7}
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
                                        <AnnotationStatusChip
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
                            <AccordionDetails
                                hidden={!annotationsOpen[annotation._id]}
                                aria-hidden={!annotationsOpen[annotation._id]}
                            >
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
                                    {['correction', 'removal'].includes(
                                        annotation.kind,
                                    ) && (
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
                                                {['', null, undefined].includes(
                                                    annotation.initialValue as any,
                                                )
                                                    ? '""'
                                                    : annotation.initialValue!.toString()}
                                            </Typography>
                                        </Box>
                                    )}
                                    {annotation.proposedValue?.length > 0 && (
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
                                            id="annotation_contributor_section"
                                        >
                                            {translate(
                                                'annotation_contributor_section',
                                            )}
                                        </Typography>
                                        <Typography
                                            aria-labelledby="annotation_contributor_section"
                                            sx={{
                                                fontStyle:
                                                    annotation.isContributorNamePublic
                                                        ? 'normal'
                                                        : 'italic',
                                            }}
                                        >
                                            {annotation.isContributorNamePublic
                                                ? annotation.authorName
                                                : translate('hidden')}
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
