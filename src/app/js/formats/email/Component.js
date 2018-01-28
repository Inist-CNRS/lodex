import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';

const EmailView = ({
    className,
    linkedResource,
    resource,
    field,
    fields,
    type,
    value,
}) => {
    let label = resource[field.name];
    const email = resource[field.name];

    switch (type) {
        case 'text':
            label = value;
            break;

        case 'column': {
            if (linkedResource) {
                const fieldForLabel = fields.find(f => f.label === value);
                label = linkedResource[fieldForLabel.name];
            }
            break;
        }

        default:
            label = resource[field.name];
            break;
    }

    return (
        <Link className={className} to={`mailto:${email}`}>
            {label}
        </Link>
    );
};

EmailView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired,
    linkedResource: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

EmailView.defaultProps = {
    className: null,
};

export default EmailView;
