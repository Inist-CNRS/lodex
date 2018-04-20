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

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <a className={className} href={`${link}`}>
                            {link}
                        </a>
                    </li>
                ))}
            </ul>
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
    value: PropTypes.string.isRequired,
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
