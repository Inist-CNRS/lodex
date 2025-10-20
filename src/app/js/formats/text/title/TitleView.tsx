import { Typography } from '@mui/material';
// @ts-expect-error TS6133
import React from 'react';
import { field as fieldPropTypes } from '../../../propTypes';

interface TitleViewInternalProps {
    value: string;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    colors: string;
}

const TitleViewInternal = ({
    level,
    value,
    colors
}: TitleViewInternalProps) => {
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

interface TitleViewProps {
    field: unknown;
    resource: object;
    level: 1 | 2 | 3 | 4 | 5 | 6;
    colors: string;
}

const TitleView = ({
    resource,
    field,
    level,
    colors
}: TitleViewProps) => {
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

TitleView.defaultProps = {
    className: null,
};

export default TitleView;
