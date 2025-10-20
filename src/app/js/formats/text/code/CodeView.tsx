// @ts-expect-error TS6133
import React from 'react';
// @ts-expect-error TS7016
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-expect-error TS7016
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { field as fieldPropTypes } from '../../../propTypes';

interface ComponentProps {
    field: unknown;
    resource: object;
    languageToHighlight: string;
}

const Component = ({
    resource,
    field,
    languageToHighlight
}: ComponentProps) => (
    <SyntaxHighlighter language={languageToHighlight} style={tomorrow}>
        {resource[field.name]}
    </SyntaxHighlighter>
);

Component.defaultProps = {
    className: null,
};

export default Component;
