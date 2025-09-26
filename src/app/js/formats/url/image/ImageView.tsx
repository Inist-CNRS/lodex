import React from 'react';
import PropTypes from 'prop-types';
// @ts-expect-error TS7016
import ImageZoom from 'react-medium-image-zoom';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
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
    resource: PropTypes.object.isRequired,
    imageWidth: PropTypes.string.isRequired,
};

ImageView.defaultProps = {
    className: null,
};

export default ImageView;
