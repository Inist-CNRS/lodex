import type { Field } from '../../../fields/types';
import getLabel from '../../utils/getLabel';
import Link from '@lodex/frontend-common/components/Link';

interface EmailViewProps {
    className?: string;
    field: Field;
    fields: Field[];
    resource: object;
    type: string;
    value: string;
}

const EmailView = ({
    className,
    resource,
    field,
    fields,
    type,
    value,
}: EmailViewProps) => {
    const label = getLabel(field, resource, fields, type, value);
    // @ts-expect-error TS7053
    const email = resource[field.name];

    return (
        <Link className={className} to={`mailto:${email}`}>
            {label}
        </Link>
    );
};

export default EmailView;
