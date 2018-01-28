import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/styles/hljs';
import { field as fieldPropTypes } from '../../propTypes';

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
