/* eslint react/no-danger: off */
import React, { PropTypes } from 'react';
import MarkdownIt from 'markdown-it';
import { field as fieldPropTypes } from '../../propTypes';

const markdown = new MarkdownIt();

const MarkdownView = ({ className, resource, field }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: markdown.render(resource[field.name]) }} />
);

MarkdownView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

MarkdownView.defaultProps = {
    className: null,
};

export default MarkdownView;
