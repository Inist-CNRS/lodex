import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const Badge = ({ value, colorsSet }) => {
    const firstColor = colorsSet.shift() || '#E7711B';
    const lastColor = colorsSet.pop() || '#F7981D';
    const styles = StyleSheet.create({
        ribbon: {
            height: '10rem',
        },
        content: {
            boxSizing: 'content-box',
            lineHeight: '0.8em',
            fontSize: '2em',
            textTransform: 'uppercase',
            textAlign: 'center',
            fontWeight: 'bold',
            textShadow: '1px 1px 5px rgba(0, 0, 0, 0.15)',
            letterSpacing: '-2px',
            display: 'block',
            width: '6rem',
            height: '4rem',
            background: `linear-gradient(to bottom, ${firstColor} 0%, ${lastColor} 100%)`,
            color: 'white',
            margin: '1rem 0.5em 0',
            float: 'left',
            paddingTop: '1rem',
            position: 'relative',
            WebkitFilter: 'drop-shadow(0 0.5rem 0.3em rgba(0, 0, 0, 0.5))',
            transform: 'translate3d(0, 0, 0)',
            ':after': {
                content: '""',
                width: 0,
                height: 0,
                borderRight: '3rem solid transparent',
                borderLeft: '3rem solid transparent',
                borderTop: `1.5rem solid ${lastColor}`,
                position: 'absolute',
                top: '5rem',
                left: '0',
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

Badge.propTypes = {
    value: PropTypes.string.isRequired, // eslint-disable-line
    colorsSet: PropTypes.array.isRequired, // eslint-disable-line
};

export default Badge;
