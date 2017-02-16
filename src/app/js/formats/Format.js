import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import DefaultFormat from './DefaultFormat';
import { getResourceLastVersion } from '../resource';

import { field as fieldPropTypes } from '../propTypes';

import uri from './uri';

const Format = ({ field, fields, linkedResource, rawLinkedResource, resource }) => {
    let Component = DefaultFormat;

    if (field.format && field.format.name) {
        switch (field.format.name) {
        case 'uri':
            Component = uri.Component;
            break;

        default:
            Component = DefaultFormat;
            break;
        }
    }

    return (
        <Component
            field={field}
            fields={fields}
            linkedResource={linkedResource}
            rawLinkedResource={rawLinkedResource}
            resource={resource}
        />
    );
};

Format.propTypes = {
    field: fieldPropTypes.isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    linkedResource: PropTypes.object, // eslint-disable-line
    rawLinkedResource: PropTypes.object, // eslint-disable-line
    resource: PropTypes.object, // eslint-disable-line
};

const mapStateToProps = (state, { linkedResource }) => ({
    linkedResource: linkedResource ? getResourceLastVersion(state, linkedResource) : null,
    rawLinkedResource: linkedResource,
});

export default connect(mapStateToProps)(Format);
