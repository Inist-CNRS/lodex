import toString from 'lodash/toString';
import { useMemo } from 'react';
// @ts-expect-error TS7016
import MarkdownIt from 'markdown-it';
import compose from 'recompose/compose';

import injectData from '../../../injectData';
import type { Field } from '../../../../fields/types';
import InvalidFormat from '../../../InvalidFormat';

const markdown = new MarkdownIt();

interface MarkdownViewProps {
    className?: string;
    field: Field;
    resource: Record<string, any>;
    formatData?: string;
}

export const MarkdownView = ({
    className,
    resource,
    field,
    formatData,
}: MarkdownViewProps) => {
    const [value, content] = useMemo(() => {
        // La valeur externe (URL) est prioritaire, sinon la valeur locale
        const value = formatData ?? resource[field.name];

        try {
            if (value.items && Array.isArray(value.items)) {
                return [
                    value,
                    markdown.render(value.items.map(toString).join('\n')),
                ];
            }
            return [value, markdown.render(toString(value))];
        } catch (e) {
            return [value, null];
        }
    }, [resource, field.name, formatData]);

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

export default compose(
    // @ts-expect-error TS2345
    injectData(({ field, resource }) => {
        // Si la valeur du champ est une URL, on la fait récupérer par injectData ;
        // sinon on renvoie null et la valeur locale est utilisée telle quelle.
        const value = resource[field.name];
        return typeof value === 'string' &&
            (/^https?:\/\//.test(value.trim()) ||
                /\/api\/run\//.test(value.trim()))
            ? value
            : null;
    }),
    // @ts-expect-error TS2345
)(MarkdownView);
