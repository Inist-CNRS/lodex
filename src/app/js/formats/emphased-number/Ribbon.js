import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Circle = ({ value, colorsSet }) => {
    const firstColor = colorsSet.shift() || '#8B8B8B'; // #1eb2df
    const middleColor = colorsSet.shift() || '#5B5B5B'; // #0675b3
    const lastColor = colorsSet.pop() || '#818181'; // #17a7d2
    const styles = StyleSheet.create({
        ribbon: {
            padding: '.34rem 1rem',
            marginLeft: '1em',
            position: 'relative',
            color: '#ffffff',
            font: ' 32px \'Patua One\', sans-serif',
            textAlign: 'center',
            letterSpacing: '0.1rem',
            textShadow: '0px -1px 0px rgba(0,0,0,0.3)',
            boxShadow: 'inset 0px 1px 0px rgba(255,255,255,.3), inset 0px 0px 20px rgba(0,0,0,0.1), 0px 1px 1px rgba(0,0,0,0.4)',
            background: `-webkit-linear-gradient(top,${firstColor}, ${lastColor})`,
            display: 'inline-block',
            ':before': {
                content: '""',
                width: '.2em',
                bottom: '-.5em',
                position: 'absolute',
                display: 'block',
                border: `.9em solid ${firstColor}`,
                boxShadow: '0px 1px 0px rgba(0,0,0,0.4)',
                zIndex: '-2',
                left: '-1.15em',
                borderRightWidth: '.75em',
                borderLeftColor: 'transparent',
            },
            ':after': {
                content: '""',
                width: '.2em',
                bottom: '-.5em',
                position: 'absolute',
                display: 'block',
                border: `.9em solid ${firstColor}`,
                boxShadow: '0px 1px 0px rgba(0,0,0,0.4)',
                zIndex: '-2',
                right: '-1.15em',
                borderLeftWidth: '.75em',
                borderRightColor: 'transparent',
            },
        },
        content: {
            ':before': {
                content: '""',
                bottom: '-.5em',
                position: 'absolute',
                display: 'block',
                borderStyle: 'solid',
                borderColor: `${middleColor} transparent transparent transparent`,
                zIndex: '-1',
                left: '0',
                borderWidth: '.5em 0 0 .5em',
            },
            ':after': {
                content: '""',
                bottom: '-.5em',
                position: 'absolute',
                display: 'block',
                borderStyle: 'solid',
                borderColor: `${middleColor} transparent transparent transparent`,
                zIndex: '-1',
                right: '0',
                borderWidth: '.5em .5em 0 0',
            },
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

Circle.propTypes = {
    value: PropTypes.string.isRequired, // eslint-disable-line
    colorsSet: PropTypes.array.isRequired, // eslint-disable-line
};

export default Circle;
