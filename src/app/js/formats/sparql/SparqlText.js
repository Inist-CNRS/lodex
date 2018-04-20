import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';
import getLabel from '../shared/getLabel';

const LinkView = ({
    className,
    linkedResource,
    resource,
    field,
    fields,
    type,
    sparql,
}) => {
    const label = getLabel(
        field,
        linkedResource,
        resource,
        fields,
        type,
        sparql,
    );

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <div>
                <h1> {links} </h1>
            </div>
        );
    }

    const link = resource[field.name];
    return (
        <a className={className} href={`${link}`}>
            {label}
        </a>
    );
};

LinkView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object,
    resource: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    sparql: PropTypes.string.isRequired,
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
