import React, { PropTypes } from 'react';
import ImageZoom from 'react-medium-image-zoom';
import { field as fieldPropTypes } from '../../propTypes';

const Image = ({ resource, field }) => {
    let maxWidth = '100%';
    if (field.format && field.format.args && field.format.args.imageWidth) {
        maxWidth = field.format.args.imageWidth;
    }
    const imageURL = resource[field.name];
    const image = {
        src: imageURL,
        className: 'img',
        style: {
            maxWidth,
        },
    };
    const zoomImage = {
        src: imageURL,
    };

    return <ImageZoom image={image} zoomImage={zoomImage} />;
};

Image.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Image.defaultProps = {
    className: null,
};

export default Image;
