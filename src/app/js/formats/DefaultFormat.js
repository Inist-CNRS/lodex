import React, { PropTypes } from 'react';
import { field as fieldPropTypes } from '../propTypes';

const DefaultView = ({ className, resource, field }) => (
    <span className={className}>{resource[field.name]}</span>
);

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired, // eslint-disable-line
};

DefaultView.defaultProps = {
    className: null,
};

const Empty = () => <span />;

export default {
    Component: DefaultView,
    EditionComponent: Empty,
};
