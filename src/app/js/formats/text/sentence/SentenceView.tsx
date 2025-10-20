// @ts-expect-error TS6133
import React from 'react';
import { field as fieldPropTypes } from '../../../propTypes';

interface SentenceViewProps {
    field: unknown;
    resource: object;
    prefix: string;
    suffix: string;
}

const SentenceView = ({
    resource,
    field,
    prefix,
    suffix
}: SentenceViewProps) => {
    const output = resource[field.name];
    return <span>{`${prefix}${output}${suffix}`}</span>;
};

export default SentenceView;
