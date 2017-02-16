import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../propTypes';

const DefaultFormat = ({ resource, field }) => (
    <span>{resource[field.name]}</span>
);

DefaultFormat.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

export default DefaultFormat;
