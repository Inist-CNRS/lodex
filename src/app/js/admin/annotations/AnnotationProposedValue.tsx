import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React, { useMemo } from 'react';

import { CellWithTooltip } from './CellWithTooltip';
import { hasFieldMultipleValues } from './helpers/field';

// @ts-expect-error TS7031
export function AnnotationProposedValue({ proposedValue, field }) {
    const valueText = useMemo(() => {
        const proposedValueAsArray = [].concat(proposedValue);

        if (hasFieldMultipleValues(field)) {
            return `[ ${proposedValueAsArray.join(', ')} ]`;
        }

        return proposedValueAsArray.at(0);
    }, [proposedValue, field]);

    // @ts-expect-error TS2322
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
