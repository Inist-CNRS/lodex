// @ts-expect-error TS7016
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-expect-error TS7016
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { type Field } from '../../../propTypes';

interface ComponentProps {
    field: Field;
    resource: object;
    languageToHighlight: string;
}

const Component = ({
    resource,
    field,
    languageToHighlight,
}: ComponentProps) => (
    <SyntaxHighlighter language={languageToHighlight} style={tomorrow}>
        {/*
         // @ts-expect-error TS7053 */}
        {resource[field.name]}
    </SyntaxHighlighter>
);

Component.defaultProps = {
    className: null,
};

export default Component;
