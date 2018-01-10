import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const sizes = ['8rem', '6rem', '3rem'];

const Bigbold = ({ value, colorsSet, size }) => {
    const color = colorsSet.shift() || '#8B8B8B';
    const currentSize = sizes[size - 1];
    const fontSize = currentSize || 'inherit';
    const fontWeight = currentSize ? 'bold' : 'normal';
    const letterSpacing = currentSize ? `-0.${5 - size}rem` : 'inherit';
    const styles = StyleSheet.create({
        ribbon: {
            marginTop: '-0.5rem',
            marginBottom: '-0.5rem',
        },
        content: {
            fontSize,
            fontWeight,
            letterSpacing,
            color,
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
