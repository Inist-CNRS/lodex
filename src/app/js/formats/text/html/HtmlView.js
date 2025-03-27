import React from 'react';
import PropTypes from 'prop-types';
import DOMPurify from "dompurify";
import { field as fieldPropTypes } from '../../../propTypes';

const HtmlView = ({ className, resource, field }) => {
    const sanitizedHTML = DOMPurify.sanitize(resource[field.name]);
    return (
        <div
            className={className}
            dangerouslySetInnerHTML={{ __html: sanitizedHTML }}
        />
    )
};


HtmlView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
};

HtmlView.defaultProps = {
    className: null,
};

export default HtmlView;
