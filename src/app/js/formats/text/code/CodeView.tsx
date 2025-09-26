// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import SyntaxHighlighter from 'react-syntax-highlighter';
// @ts-expect-error TS7016
import { tomorrow } from 'react-syntax-highlighter/dist/cjs/styles/hljs';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
const Component = ({ resource, field, languageToHighlight }) => (
    <SyntaxHighlighter language={languageToHighlight} style={tomorrow}>
        {resource[field.name]}
    </SyntaxHighlighter>
);

Component.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    languageToHighlight: PropTypes.string.isRequired,
};

Component.defaultProps = {
    className: null,
};

export default Component;
