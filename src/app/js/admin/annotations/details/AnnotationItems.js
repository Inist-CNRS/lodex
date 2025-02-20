import Grid from '@mui/material/Grid';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import React from 'react';

import FieldRepresentation from '../../../fields/FieldRepresentation';
import { useTranslate } from '../../../i18n/I18NContext';
import { hasFieldMultipleValues } from '../helpers/field';
import { AnnotationProposedValue } from './AnnotationProposedValue';
import { ANNOTATION_GRID_COLUMNS, AnnotationValue } from './AnnotationValue';

const ANNOTATION_GRID_SPACING = 1;

function Section({ label, children, translateOptions = {} }) {
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

export function AnnotationItems({ annotation }) {
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

            {annotation.initialValue && (
                <Section label="annotation_initial_value">
                    <Typography
                        aria-labelledby="annotation_initial_value"
                        component="pre"
                        whiteSpace="pre-wrap"
                        sx={{
                            textAlign: 'justify',
                        }}
                    >
                        {annotation.initialValue}
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

AnnotationItems.propTypes = {
    annotation: PropTypes.object.isRequired,
};
