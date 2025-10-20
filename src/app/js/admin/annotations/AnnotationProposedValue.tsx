// @ts-expect-error TS6133
import React, { useMemo } from 'react';

import { CellWithTooltip } from './CellWithTooltip';
import { hasFieldMultipleValues } from './helpers/field';

interface AnnotationProposedValueProps {
    field?: {
        annotationFormat?: "text" | "list";
        annotationFormatListKind?: "single" | "multiple";
    };
    proposedValue: string | string[];
}

export function AnnotationProposedValue({
    proposedValue,
    field
}: AnnotationProposedValueProps) {
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
