import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import React from 'react';

import FieldRepresentation from '../../fields/FieldRepresentation';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import { hasFieldMultipleValues } from '../helpers/field';
import { AnnotationProposedValue } from './AnnotationProposedValue';
import { ANNOTATION_GRID_COLUMNS, AnnotationValue } from './AnnotationValue';

const ANNOTATION_GRID_SPACING = 1;

interface SectionProps {
    label: string;
    children: React.ReactNode;
    translateOptions?: object;
}

function Section({ label, children, translateOptions }: SectionProps) {
    const { translate } = useTranslate();

    const translatedLabel = translate(label, translateOptions);

    return (
        <Stack gap={1} aria-label={translatedLabel} role="region">
            <Typography variant="h2" fontSize={20} id={label} fontWeight={700}>
                {translatedLabel}
            </Typography>
            {children}
        </Stack>
    );
}

interface AnnotationItemsProps {
    annotation: {
        _id: string;
        kind: string;
        field?: {
            _id: string;
            name: string;
            multiple: boolean;
            annotationFormat?: 'text' | 'list';
            annotationFormatListKind?: 'single' | 'multiple';
            annotationFormatListOptions?: string[];
        };
        initialValue: any;
        proposedValue: any;
        comment: string;
        authorName: string;
        authorEmail?: string;
        createdAt: string;
        updatedAt: string;
    };
}

export function AnnotationItems({ annotation }: AnnotationItemsProps) {
    const { translate } = useTranslate();

    return (
        <Stack gap={6}>
            <Section label="annotation_field_section">
                {annotation.field ? (
                    <FieldRepresentation field={annotation.field} />
                ) : (
                    translate('annotation_field_not_found')
                )}
            </Section>

            {['removal', 'correction'].includes(annotation.kind) && (
                <Section label="annotation_initial_value">
                    <Typography
                        aria-labelledby="annotation_initial_value"
                        component="pre"
                        whiteSpace="pre-wrap"
                        sx={{
                            textAlign: 'justify',
                        }}
                    >
                        {[null, undefined, ''].includes(
                            annotation.initialValue as string,
                        )
                            ? '""'
                            : annotation.initialValue.toString()}
                    </Typography>
                </Section>
            )}

            {annotation.proposedValue && (
                <Section
                    label="annotation_proposed_value"
                    translateOptions={{
                        smart_count: hasFieldMultipleValues(annotation.field)
                            ? annotation.proposedValue.length
                            : 1,
                    }}
                >
                    <AnnotationProposedValue
                        proposedValue={annotation.proposedValue}
                        // @ts-expect-error TS2322
                        field={annotation.field}
                    />
                </Section>
            )}

            <Section label="annotation_comment_section">
                <Typography
                    aria-labelledby="annotation_comment_section"
                    component="pre"
                    whiteSpace="pre-wrap"
                >
                    {annotation.comment}
                </Typography>
            </Section>

            <Section label="annotation_contributor_section">
                <Stack gap={1}>
                    <Typography>{annotation.authorName}</Typography>
                    {annotation.authorEmail && (
                        <Typography>
                            <Link
                                href={`mailto:${annotation.authorEmail}`}
                                fontSize={16}
                            >
                                {annotation.authorEmail}
                            </Link>
                        </Typography>
                    )}
                </Stack>
            </Section>

            <Section label="annotation_complementary_infos_section">
                <Grid
                    container
                    spacing={ANNOTATION_GRID_SPACING}
                    columns={ANNOTATION_GRID_COLUMNS}
                >
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
            </Section>
        </Stack>
    );
}
