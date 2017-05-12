/* eslint react/no-danger: off */
import React, { PropTypes } from 'react';
import marked from 'marked';
import { field as fieldPropTypes } from '../../propTypes';

const MarkdownView = ({ className, resource, field }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: marked(resource[field.name]) }} />
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
