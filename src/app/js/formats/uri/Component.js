import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../../propTypes';

const UriView = ({ linkedResource, resource, field }) => {
    const uri = resource[field.name];
    let label = resource[field.name];

    if (field.format && field.format.args && field.format.args.type) {
        switch (field.format.args.type) {
        case 'text':
            label = field.format.args.value;
            break;

        case 'column': {
            if (linkedResource) {
                label = linkedResource[field.format.args.value];
            }
            break;
        }

        default:
            label = resource[field.name];
            break;
        }
    }

    return <Link to={`/resource?uri=${uri}`}>{label}</Link>;
};

UriView.propTypes = {
    field: fieldPropTypes.isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default UriView;
