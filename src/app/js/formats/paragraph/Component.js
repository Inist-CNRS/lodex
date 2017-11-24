import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const Paragraph = ({ resource, field }) => {
    let maxWidth = '100%';
    if (field.format && field.format.args && field.format.args.paragraphWidth) {
        maxWidth = field.format.args.paragraphWidth;
    }
    const style = {
        maxWidth,
        padding: 8,
        textAlign: 'justify',
    };

    return <p style={style}>{resource[field.name]}</p>;
};

Paragraph.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Paragraph.defaultProps = {
    className: null,
};

export default Paragraph;
