// @ts-expect-error TS7016
import ImageZoom from 'react-medium-image-zoom';
import type { Field } from '../../../fields/types';

interface ImageViewProps {
    field: Field;
    resource: object;
    imageWidth: string;
}

const ImageView = ({ resource, field, imageWidth }: ImageViewProps) => {
    // @ts-expect-error TS7053
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

export default ImageView;
