import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';

const UriView = ({
    className,
    linkedResource,
    resource,
    field,
    fields,
    type,
    value,
}) => {
    const uri = resource[field.name];
    let label;

    switch (type) {
        case 'text':
            label = value;
            break;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(
                    f => f.label === field.format.args.value,
                );
                label = linkedResource[fieldForLabel.name];
            }
            break;
        }
        case 'value':
        default:
            label = uri;
            break;
    }

    return (
        <Link className={className} to={getResourceUri({ uri })}>
            {label}
        </Link>
    );
};

UriView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    type: PropTypes.oneOf(['value', 'text', 'column']),
    value: PropTypes.string.isRequired,
};

UriView.defaultProps = {
    className: null,
};

export default UriView;
