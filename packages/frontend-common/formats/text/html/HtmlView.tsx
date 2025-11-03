import DOMPurify from 'dompurify';
import type { Field } from '@lodex/frontend-common/fields/types';

interface HtmlViewProps {
    className?: string;
    field: Field;
    resource: object;
}

const HtmlView = ({ className, resource, field }: HtmlViewProps) => {
    // @ts-expect-error TS7053
    const sanitizedHTML = DOMPurify.sanitize(resource[field.name]);
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    );
};

export default HtmlView;
