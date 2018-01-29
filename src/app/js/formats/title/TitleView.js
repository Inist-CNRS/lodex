import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const TitleView = ({ resource, field, level }) => {
    const value = resource[field.name];
    switch (level) {
        case 6:
            return <h6>{value}</h6>;
        case 5:
            return <h5>{value}</h5>;
        case 4:
            return <h4>{value}</h4>;
        case 3:
            return <h3>{value}</h3>;
        case 2:
            return <h2>{value}</h2>;
        case 1:
        default:
            return <h1>{value}</h1>;
    }
};

TitleView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
};

TitleView.defaultProps = {
    className: null,
};

export default TitleView;
