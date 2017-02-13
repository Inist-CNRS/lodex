import React, { PropTypes } from 'react';
import { Link } from 'react-router';

const UriComponent = ({ resource, field }) => {
    let label = resource[field.name];

    if (field.format.args.type) {
        switch (field.format.args.type) {
        case 'test':
            label = field.format.args.value;
            break;

        case 'column': {
            label = resource[field.format.args.value];
            break;
        }

        default:
            label = resource[field.name];
            break;
        }
    }

    return <a href={resource[field.name]}>{label}</a>;
};

UriComponent.propTypes = {
    args: PropTypes.array.isRequired, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
    field: PropTypes.object.isRequired, // eslint-disable-line
    fields: PropTypes.array.isRequired, // eslint-disable-line
};

export default UriComponent;
