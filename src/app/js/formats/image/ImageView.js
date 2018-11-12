import React from 'react';
import PropTypes from 'prop-types';
import ImageZoom from 'react-medium-image-zoom';
import { field as fieldPropTypes } from '../../propTypes';

const ImageView = ({ resource, field, imageWidth }) => {
    const imageURL = resource[field.name];
    const image = {
        src: imageURL,
        className: 'img',
        style: {
            maxWidth: imageWidth,
        },
    };
    const zoomImage = {
        src: imageURL,
    };

    return <ImageZoom key={imageWidth} image={image} zoomImage={zoomImage} />;
};

ImageView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
    imageWidth: PropTypes.string.isRequired,
};

ImageView.defaultProps = {
    className: null,
};

export default ImageView;
