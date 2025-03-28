import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../../propTypes';

const getParagraphWidth = (paragraphWidth, field) => {
    if (field.format.args.paragraphWidth) {
        return field.format.args.paragraphWidth;
    }
    return paragraphWidth;
};

const ParagraphView = ({ resource, field, paragraphWidth, colors }) => {
    const style = {
        maxWidth: getParagraphWidth(paragraphWidth, field),
        padding: 8,
        textAlign: 'justify',
        color: colors.split(' ')[0],
    };

    return <p style={style}>{resource[field.name]}</p>;
};

ParagraphView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    paragraphWidth: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
};

ParagraphView.defaultProps = {
    className: null,
};

export default ParagraphView;
