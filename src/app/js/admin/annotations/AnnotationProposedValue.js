import PropTypes from 'prop-types';
import React, { useMemo } from 'react';

import { CellWithTooltip } from './CellWithTooltip';
import { hasFieldMultipleValues } from './helpers/field';

export function AnnotationProposedValue({ proposedValue, field }) {
    const valueText = useMemo(() => {
        const proposedValueAsArray = [].concat(proposedValue);

        if (hasFieldMultipleValues(field)) {
            return `[ ${proposedValueAsArray.join(', ')} ]`;
        }

        return proposedValueAsArray.at(0);
    }, [proposedValue, field]);

    return <CellWithTooltip value={valueText} />;
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
