// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';

import { field as fieldPropTypes } from '../../../propTypes';
import getLabel from '../../utils/getLabel';
import Link from '../../../lib/components/Link';

// @ts-expect-error TS7031
const LinkView = ({ className, resource, field, fields, type, value }) => {
    const label = getLabel(field, resource, fields, type, value);

    if (Array.isArray(resource[field.name])) {
        const links = resource[field.name];

        return (
            <ul>
                {/*
                 // @ts-expect-error TS7006 */}
                {links.map((link, index) => (
                    <li key={index}>
                        {/*
                         // @ts-expect-error TS2739 */}
                        <Link
                            className={className}
                            href={`${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {link}
                        </Link>
                    </li>
                ))}
            </ul>
        );
    }

    const link = resource[field.name];

    return (
        // @ts-expect-error TS2739
        <Link
            className={className}
            href={`${link}`}
            target="_blank"
            rel="noopener noreferrer"
        >
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
