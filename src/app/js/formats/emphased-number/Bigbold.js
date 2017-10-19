import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Bigbold = ({ value, colorsSet }) => {
    const firstColor = colorsSet.shift() || '#8B8B8B';
    const lastColor = colorsSet.pop() || '#818181';
    const styles = StyleSheet.create({
        ribbon: {
            height: '8rem',
        },
        content: {
            fontSize: '8rem',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            letterSpacing: '-.5rem',
            color: `${firstColor}`,
        },
    });
    return (
        <div className={css(styles.ribbon)}>
            <div className={css(styles.content)}>
                { value }
            </div>
        </div>
    );
};

Bigbold.propTypes = {
    value: PropTypes.string.isRequired, // eslint-disable-line
    colorsSet: PropTypes.array.isRequired, // eslint-disable-line
};

export default Bigbold;
