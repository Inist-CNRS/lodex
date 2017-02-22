import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../propTypes';

const DefaultView = ({ resource, field }) => (
    <span>{resource[field.name]}</span>
);

DefaultView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

const Empty = () => <span />;

export default {
    Component: DefaultView,
    EditionComponent: Empty,
};
