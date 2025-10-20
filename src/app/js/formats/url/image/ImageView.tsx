// @ts-expect-error TS6133
import React from 'react';
// @ts-expect-error TS7016
import ImageZoom from 'react-medium-image-zoom';
import { field as fieldPropTypes } from '../../../propTypes';

interface ImageViewProps {
    field: unknown;
    resource: object;
    imageWidth: string;
}

const ImageView = ({
    resource,
    field,
    imageWidth
}: ImageViewProps) => {
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

ImageView.defaultProps = {
    className: null,
};

export default ImageView;
