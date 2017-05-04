import React, { PropTypes } from 'react';
import ImageZoom from 'react-medium-image-zoom';
import { field as fieldPropTypes } from '../../propTypes';

const Image = ({ linkedResource, resource, field, fields }) => {
    let imageLabel;
    if (field.format && field.format.args && field.format.args.type) {
        switch (field.format.args.type) {
        case 'text':
            imageLabel = field.format.args.value;
            break;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(f => f.label === field.format.args.value);
                imageLabel = linkedResource[fieldForLabel.name];
            }
            break;
        }

        default:
            imageLabel = resource[field.name];
            break;
        }
    }

    const imageURL = resource[field.name];
    const image = {
        src: imageURL,
        alt: imageLabel,
        className: 'img',
        style: {
            maxWidth: '100%',
        },
    };
    const zoomImage = {
        src: imageURL,
        alt: imageLabel,
    };

    return <ImageZoom image={image} zoomImage={zoomImage} />;
};

Image.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

Image.defaultProps = {
    className: null,
};

export default Image;
