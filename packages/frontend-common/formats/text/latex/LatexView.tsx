import classnames from 'classnames';
import katex from 'katex';
import Helmet from 'react-helmet';
import InvalidFormat from '../../InvalidFormat';

import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import type { Field } from '@lodex/frontend-common/fields/types';

const styles = stylesToClassname(
    {
        container: {
            padding: 0,
            margin: 0,
        },
    },
    'latex',
);

interface LatexViewProps {
    field: Field;
    resource: object;
}

const LatexView = ({ resource, field }: LatexViewProps) => {
    const KatexOptions = {
        displayMode: false,
        leqno: true,
        fleqn: true,
        throwOnError: false,
        errorColor: '#cc0000',
        strict: 'warn',
        output: 'html',
        trust: false,
    };
    // @ts-expect-error TS7053
    const value = resource[field.name];
    // @ts-expect-error TS18046
    const delimiter = field.format.args.delimiter.trim();
    const parts =
        delimiter !== ''
            ? // @ts-expect-error TS7053
              resource[field.name].split(delimiter)
            : // @ts-expect-error TS7053
              ['', resource[field.name]];

    let html;
    try {
        html = parts
            .reduce(
                // @ts-expect-error TS7006
                (acc, cur, index) =>
                    acc.concat(
                        index % 2 === 0
                            ? cur
                            : // @ts-expect-error TS2345
                              katex.renderToString(cur, KatexOptions),
                    ),
                [],
            )
            .join('');
    } catch (e) {
        // @ts-expect-error TS18046
        return <InvalidFormat format={field.format} value={value} />;
    }

    return (
        // @ts-expect-error TS2339
        <div className={classnames('latex-container', styles.container)}>
            <Helmet>
                <link
                    rel="stylesheet"
                    href="https://cdn.jsdelivr.net/npm/katex@0.13.3/dist/katex.min.css"
                    integrity="sha384-ThssJ7YtjywV52Gj4JE/1SQEDoMEckXyhkFVwaf4nDSm5OBlXeedVYjuuUd0Yua+"
                    crossOrigin="anonymous"
                />
            </Helmet>
            <div
                dangerouslySetInnerHTML={{
                    __html: html,
                }}
            />
        </div>
    );
};

export default LatexView;
