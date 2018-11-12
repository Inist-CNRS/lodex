import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../propTypes';
import getLabel from '../shared/getLabel';
import Link from '../../lib/components/Link';

const LinkView = ({ className, resource, field, fields, type, value }) => {
    const label = getLabel(field, resource, fields, type, value);

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <ul>
                {links.map((link, index) => (
                    <li key={index}>
                        <Link className={className} href={`${link}`}>
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    const link = resource[field.name];

    return (
        <Link className={className} href={`${link}`}>
            {label}
        </Link>
    );
};

LinkView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    resource: PropTypes.object.isRequired,
    type: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
};

LinkView.defaultProps = {
    className: null,
};

export default LinkView;
