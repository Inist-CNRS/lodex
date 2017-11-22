import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const sizes = ['8rem', '6rem', '3rem'];

const Bigbold = ({ value, colorsSet, size }) => {
    const firstColor = colorsSet.shift() || '#8B8B8B';
    const siz = sizes[size - 1] || '8rem';
    const styles = StyleSheet.create({
        ribbon: {
            height: sizes[size],
        },
        content: {
            fontSize: siz,
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '-.5rem',
            color: `${firstColor}`,
        },
    });
    return (
        <div className={css(styles.ribbon)}>
            <div className={css(styles.content)}>{value}</div>
        </div>
    );
};

Bigbold.propTypes = {
    value: PropTypes.string.isRequired, // eslint-disable-line
    colorsSet: PropTypes.array.isRequired, // eslint-disable-line
    size: PropTypes.number.isRequired, // eslint-disable-line
};

export default Bigbold;
