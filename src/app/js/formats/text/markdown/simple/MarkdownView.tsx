// @ts-expect-error TS6133
import React, { useMemo } from 'react';
// @ts-expect-error TS7016
import MarkdownIt from 'markdown-it';

import { field as fieldPropTypes } from '../../../../propTypes';
import InvalidFormat from '../../../InvalidFormat';

const markdown = new MarkdownIt();

interface MarkdownViewProps {
    className?: string;
    field: unknown;
    resource: object;
}

const MarkdownView = ({
    className,
    resource,
    field
}: MarkdownViewProps) => {
    const [value, content] = useMemo(() => {
        const value = resource[field.name];

        try {
            return [value, markdown.render(value)];
        } catch (e) {
            return [value, null];
        }
    }, [resource, field.name]);

    if (content == null) {
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

MarkdownView.defaultProps = {
    className: null,
};

export default MarkdownView;
