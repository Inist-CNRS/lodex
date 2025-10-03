import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';

import FieldRepresentation from '../../../fields/FieldRepresentation';
import { useTranslate } from '../../../i18n/I18NContext';
import { hasFieldMultipleValues } from '../helpers/field';
import { AnnotationProposedValue } from './AnnotationProposedValue';
import { ANNOTATION_GRID_COLUMNS, AnnotationValue } from './AnnotationValue';

const ANNOTATION_GRID_SPACING = 1;

// @ts-expect-error TS7031
function Section({ label, children, translateOptions }) {
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

Section.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    translateOptions: PropTypes.object,
};

// @ts-expect-error TS7031
export function AnnotationItems({ annotation }) {
    const { translate } = useTranslate();

    return (
        <Stack gap={6}>
            <Section label="annotation_field_section">
                {/*
                 // @ts-expect-error TS2322 */}
                {annotation.field ? (
                    <FieldRepresentation field={annotation.field} />
                ) : (
                    translate('annotation_field_not_found')
                )}
            </Section>

            {['removal', 'correction'].includes(annotation.kind) && (
                <Section label="annotation_initial_value">
                    {/*
                     // @ts-expect-error TS2322 */}
                    <Typography
                        aria-labelledby="annotation_initial_value"
                        component="pre"
                        whiteSpace="pre-wrap"
                        sx={{
                            textAlign: 'justify',
                        }}
                    >
                        {[null, undefined, ''].includes(annotation.initialValue)
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
                    {/*
                     // @ts-expect-error TS2322 */}
                    <AnnotationProposedValue
                        proposedValue={annotation.proposedValue}
                        field={annotation.field}
                    />
                </Section>
            )}

            <Section label="annotation_comment_section">
                {/*
                 // @ts-expect-error TS2322 */}
                <Typography
                    aria-labelledby="annotation_comment_section"
                    component="pre"
                    whiteSpace="pre-wrap"
                >
                    {annotation.comment}
                </Typography>
            </Section>

            <Section label="annotation_contributor_section">
                {/*
                 // @ts-expect-error TS2322 */}
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
                {/*
                 // @ts-expect-error TS2322 */}
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

AnnotationItems.propTypes = {
    annotation: PropTypes.object.isRequired,
};
