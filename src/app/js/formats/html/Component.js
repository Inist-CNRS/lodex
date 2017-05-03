/* eslint react/no-danger: off */
import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../../propTypes';

const HtmlView = ({ className, resource, field }) => (
    <div className={className} dangerouslySetInnerHTML={{ __html: resource[field.name] }} />
);

HtmlView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

HtmlView.defaultProps = {
    className: null,
};

export default HtmlView;
