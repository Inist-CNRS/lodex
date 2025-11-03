import type { Field } from '../../../fields/types';

interface SentenceViewProps {
    field: Field;
    resource: object;
    prefix: string;
    suffix: string;
}

const SentenceView = ({
    resource,
    field,
    prefix,
    suffix,
}: SentenceViewProps) => {
    // @ts-expect-error TS7053
    const output = resource[field.name];
    return <span>{`${prefix}${output}${suffix}`}</span>;
};

export default SentenceView;
