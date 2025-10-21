import { useMemo } from 'react';
// @ts-expect-error TS7016
import MarkdownIt from 'markdown-it';

import { type Field } from '../../../../propTypes';
import InvalidFormat from '../../../InvalidFormat';

const markdown = new MarkdownIt();

interface MarkdownViewProps {
    className?: string;
    field: Field;
    resource: object;
}

const MarkdownView = ({ className, resource, field }: MarkdownViewProps) => {
    const [value, content] = useMemo(() => {
        // @ts-expect-error TS7053
        const value = resource[field.name];

        try {
            return [value, markdown.render(value)];
        } catch (e) {
            return [value, null];
        }
    }, [resource, field.name]);

    if (content == null) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={value} />;
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{
                __html: content,
            }}
        />
    );
};

export default MarkdownView;
