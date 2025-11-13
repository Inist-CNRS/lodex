import getLabel from '../../utils/getLabel';
import Link from '../../../components/Link';

interface LinkViewProps {
    className?: string;
    field: {
        name: string;
    };
    fields: unknown[];
    resource: Record<string, unknown>;
    type: string;
    value: string;
}

const LinkView = ({
    className,
    resource,
    field,
    fields,
    type,
    value,
}: LinkViewProps) => {
    const label = getLabel(field, resource, fields, type, value);

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <ul>
                {/*
                 // @ts-expect-error TS7006 */}
                {links.map((link, index) => (
                    <li key={index}>
                        <Link
                            className={className}
                            href={`${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    const link = resource[field.name];

    return (
        <Link
            className={className}
            href={`${link}`}
            target="_blank"
            rel="noopener noreferrer"
        >
            {label}
        </Link>
    );
};

export default LinkView;
