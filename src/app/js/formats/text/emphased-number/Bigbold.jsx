import React from 'react';
import PropTypes from 'prop-types';

import stylesToClassname from '../../../lib/stylesToClassName';
import { MONOCHROMATIC_DEFAULT_COLORSET } from '../../utils/colorUtils';

const sizes = ['7rem', '5rem', '2rem'];

const styles = stylesToClassname(
    {
        ribbon: {
            marginTop: '-0.5rem',
            marginBottom: '-0.5rem',
        },
    },
    'big-bold',
);

const getContentInlineStyle = (colors, size) => {
    const color = colors.split(' ')[0] || MONOCHROMATIC_DEFAULT_COLORSET;
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

const Bigbold = ({ value, colors, size }) => (
    <div className={styles.ribbon}>
        <div className="content" style={getContentInlineStyle(colors, size)}>
            {value}
        </div>
    </div>
);

Bigbold.propTypes = {
    value: PropTypes.string.isRequired,
    colors: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
};

export default Bigbold;
