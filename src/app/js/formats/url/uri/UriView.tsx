import { getResourceUri } from '../../../../../common/uris';
import getLabel from '../../utils/getLabel';
import InvalidFormat from '../../InvalidFormat';
import Link from '../../../lib/components/Link';

interface UriViewProps {
    className?: string;
    field: {
        name: string;
        format: string;
    };
    fields: unknown[];
    resource: Record<string, any>;
    type?: 'value' | 'text' | 'column';
    value: string;
}

const UriView = ({
    className,
    resource,
    field,
    fields,
    type,
    value,
}: UriViewProps) => {
    const uri = resource[field.name];

    if (Array.isArray(uri)) {
        return uri.map((uriItem, index) => {
            const label = getLabel(field, resource, fields, type, value);

            const currentLabel = Array.isArray(label) ? label[index] : label;

            return (
                <div key={uriItem}>
                    <Link
                        className={className}
                        to={getResourceUri({ uri: uriItem })}
                    >
                        {currentLabel}
                    </Link>
                </div>
            );
        });
    }

    if (!uri || typeof uri !== 'string') {
        return <InvalidFormat format={field.format} value={uri} />;
    }

    const label = getLabel(field, resource, fields, type, value);

    return (
        <Link className={className} to={getResourceUri({ uri })}>
            {label}
        </Link>
    );
};

export default UriView;

// @ts-expect-error TS7031
export const getReadableValue = ({ resource, field, type, value }) => {
    const uri = resource[field.name];

    if (Array.isArray(uri)) {
        return uri.map((_uriItem, index) => {
            const label = getLabel(field, resource, null, type, value);

            const currentLabel = Array.isArray(label) ? label[index] : label;

            return currentLabel;
        });
    }

    if (!uri || typeof uri !== 'string') {
        return uri;
    }

    const label = getLabel(field, resource, null, type, value);

    return label;
};
