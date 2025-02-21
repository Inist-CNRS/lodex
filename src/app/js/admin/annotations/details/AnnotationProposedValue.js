import { List, ListItem, ListItemText, Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { hasFieldMultipleValues } from '../helpers/field';

export function AnnotationProposedValue({ proposedValue, field }) {
    const proposedValueAsArray = useMemo(() => {
        return [].concat(proposedValue);
    }, [proposedValue]);

    if (hasFieldMultipleValues(field)) {
        return (
            <List>
                {proposedValueAsArray.map((value) => (
                    <ListItem key={value}>
                        <ListItemText primary={value} />
                    </ListItem>
                ))}
            </List>
        );
    }

    return (
        <Typography
            aria-labelledby="annotation_proposed_value"
            component="pre"
            whiteSpace="pre-wrap"
            sx={{
                textAlign: 'justify',
            }}
        >
            {proposedValueAsArray.at(0)}
        </Typography>
    );
}

AnnotationProposedValue.propTypes = {
    field: PropTypes.shape({
        annotationFormat: PropTypes.oneOf(['text', 'list']),
        annotationFormatListKind: PropTypes.oneOf(['single', 'multiple']),
    }),
    proposedValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.arrayOf(PropTypes.string),
    ]).isRequired,
};
