import React from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { tomorrow } from 'react-syntax-highlighter/styles/hljs';
import get from 'lodash.get';
import { field as fieldPropTypes } from '../../propTypes';

const Component = ({ resource, field }) => {
    const languageToHighlight = get(
        field,
        'format.args.languageToHighlight',
        '',
    );
    return (
        <SyntaxHighlighter language={languageToHighlight} style={tomorrow}>
            {resource[field.name]}
        </SyntaxHighlighter>
    );
};

Component.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Component.defaultProps = {
    className: null,
};

export default Component;
