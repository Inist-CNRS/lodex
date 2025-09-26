import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { field as fieldPropTypes } from '../../../propTypes';

// @ts-expect-error TS7031
const TitleViewInternal = ({ level, value, colors }) => {
    const style = {
        display: 'inline-block',
        width: 'fit-content',
        color: colors.split(' ')[0],
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
TitleViewInternal.propTypes = {
    value: PropTypes.string.isRequired,
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
    colors: PropTypes.string.isRequired,
};

// @ts-expect-error TS7031
const TitleView = ({ resource, field, level, colors }) => {
    const value = resource[field.name];
    return (
        <Typography
            className="property_value_item property_value_heading"
            sx={{
                position: 'relative',
                display: 'inline-block',
                width: 'fit-content',
            }}
        >
            <TitleViewInternal level={level} value={value} colors={colors} />
        </Typography>
    );
};

TitleView.propTypes = {
    field: fieldPropTypes.isRequired,
    resource: PropTypes.object.isRequired,
    level: PropTypes.oneOf([1, 2, 3, 4, 5, 6]).isRequired,
    colors: PropTypes.string.isRequired,
};

TitleView.defaultProps = {
    className: null,
};

export default TitleView;
