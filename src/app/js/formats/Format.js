import React, { PropTypes } from 'react';
import DefaultFormat from './DefaultFormat';

import uri from './uri';

const Format = ({ resource, field, fields }) => {
    let Component = DefaultFormat;

    if (field.format && field.format.name) {
        switch (field.format.name) {
        case 'uri':
            Component = uri.component;
            break;

        default:
            Component = DefaultFormat;
            break;
        }
    }

    return (
        <Component
            resource={resource}
            field={field}
            fields={fields}
        />
    );
};

export default Format;
