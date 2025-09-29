import PropTypes from 'prop-types';
// @ts-expect-error TS6133
import React from 'react';

import { Typography } from '@mui/material';
import {
    PROPOSED,
    REJECTED,
    VALIDATED,
    // @ts-expect-error TS7016
} from '../../../../../../common/propositionStatus';
// @ts-expect-error TS7016
import { canonicalURL, isLocalURL, isURL } from '../../../../../../common/uris';
import Link from '../../../../lib/components/Link';
import { getShortText, isLongText } from '../../../../lib/longTexts';
import { field as fieldPropTypes } from '../../../../propTypes';

const styles = {
    [REJECTED]: {
        fontSize: '1rem',
        textDecoration: 'line-through',
    },
    [PROPOSED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
    [VALIDATED]: {
        fontSize: '1rem',
        textDecoration: 'none',
    },
};

// @ts-expect-error TS7031
const DefaultView = ({ className, resource, field, fieldStatus, shrink }) => {
    const value = resource[field.name];

    if (isURL(value)) {
        return (
            // @ts-expect-error TS2739
            <Link style={styles[fieldStatus]} href={`${value}`}>
                {value}
            </Link>
        );
    }
    if (isLocalURL(value)) {
        return (
            // @ts-expect-error TS2739
            <Link style={styles[fieldStatus]} href={`${canonicalURL(value)}`}>
                {value}
            </Link>
        );
    }

    const text = shrink && isLongText(value) ? getShortText(value) : value;
    return (
        <Typography
            component="span"
            className="property_value_item"
            sx={styles[fieldStatus]}
        >
            <span className={className}>{text}</span>
        </Typography>
    );
};

DefaultView.propTypes = {
    className: PropTypes.string,
    field: fieldPropTypes.isRequired,
    fieldStatus: PropTypes.string,
    resource: PropTypes.any.isRequired,
    shrink: PropTypes.bool,
};

DefaultView.defaultProps = {
    className: null,
    fieldStatus: null,
    shrink: false,
};

export default DefaultView;

// @ts-expect-error TS7031
export const getReadableValue = ({ resource, field }) => {
    return resource[field.name];
};
