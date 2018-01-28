import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const Paragraph = ({ resource, field, paragraphWidth }) => {
    const style = {
        maxWidth: paragraphWidth,
        padding: 8,
        textAlign: 'justify',
    };

    return <p style={style}>{resource[field.name]}</p>;
};

Paragraph.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    paragraphWidth: PropTypes.string.isRequired,
};

Paragraph.defaultProps = {
    className: null,
};

export default Paragraph;
