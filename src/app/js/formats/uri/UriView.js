import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router';
import { field as fieldPropTypes } from '../../propTypes';
import { getResourceUri } from '../../../../common/uris';
import getLabel from '../shared/getLabel';

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
    const label = getLabel(
        field,
        linkedResource,
        resource,
        fields,
        type,
        value,
    );

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
