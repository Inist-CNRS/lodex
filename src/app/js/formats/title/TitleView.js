import React from 'react';
import PropTypes from 'prop-types';
import { field as fieldPropTypes } from '../../propTypes';

const TitleView = ({ resource, field, level, textColor }) => {
    const value = resource[field.name];
    const style = {
        color: textColor,
    };
    switch (level) {
        case 6:
            return <h6 style={style}>{value}</h6>;
        case 5:
            return <h5 style={style}>{value}</h5>;
        case 4:
            return <h4 style={style}>{value}</h4>;
        case 3:
            return <h3 style={style}>{value}</h3>;
        case 2:
            return <h2 style={style}>{value}</h2>;
        case 1:
        default:
            return <h1 style={style}>{value}</h1>;
    }
};

TitleView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
    textColor: PropTypes.string.isRequired,
};

TitleView.defaultProps = {
    className: null,
};

export default TitleView;
