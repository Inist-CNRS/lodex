import React, { PropTypes } from 'react';

const DefaultFormat = ({ resource, field }) => (
    <span>{resource[field.name]}</span>
);

export default DefaultFormat;
