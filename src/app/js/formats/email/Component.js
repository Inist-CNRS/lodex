import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';
import getLabel from '../shared/getLabel';

const EmailView = ({
    className,
    linkedResource,
    resource,
    field,
    fields,
    type,
    value,
}) => {
    const label = getLabel(
        field,
        linkedResource,
        resource,
        fields,
        type,
        value,
    );
    const email = resource[field.name];

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
