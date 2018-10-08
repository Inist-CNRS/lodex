/* eslint react/no-danger: off */
import React from 'react';
import PropTypes from 'prop-types';
import MarkdownIt from 'markdown-it';

import { field as fieldPropTypes } from '../../propTypes';
import InvalidFormat from '../InvalidFormat';

const markdown = new MarkdownIt();

const MarkdownView = ({ className, resource, field }) => {
    const value = resource[field.name];

    if (!value) {
        return <InvalidFormat format={field.format} value={value} />;
    }

    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{
                __html: markdown.render(value),
            }}
        />
    );
};

MarkdownView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

MarkdownView.defaultProps = {
    className: null,
};

export default MarkdownView;
