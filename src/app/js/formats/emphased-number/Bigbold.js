import React from 'react';
import PropTypes from 'prop-types';

import stylesToClassname from '../../lib/stylesToClassName';

const sizes = ['8rem', '6rem', '3rem'];

const styles = stylesToClassname(
    {
        ribbon: {
            marginTop: '-0.5rem',
            marginBottom: '-0.5rem',
        },
    },
    'big-bold',
);

const getContentInlineStyle = (colorsSet, size) => {
    const color = colorsSet.shift() || '#8B8B8B';
    const currentSize = sizes[size - 1];
    const fontSize = currentSize || 'inherit';
    const fontWeight = currentSize ? 'bold' : 'normal';
    const letterSpacing = currentSize ? `-0.${5 - size}rem` : 'inherit';

    return {
        fontSize,
        fontWeight,
        letterSpacing,
        color,
    };
};

const Bigbold = ({ value, colorsSet, size }) => (
    <div className={styles.ribbon}>
        <div className="content" style={getContentInlineStyle(colorsSet, size)}>
            {value}
        </div>
    </div>
);

Bigbold.propTypes = {
    value: PropTypes.string.isRequired,
    colorsSet: PropTypes.array.isRequired,
    size: PropTypes.number.isRequired,
};

export default Bigbold;
