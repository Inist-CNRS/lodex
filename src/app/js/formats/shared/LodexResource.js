import React, { PropTypes } from 'react';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    contentTitle: {
        fontSize: '16px',
        lineHeight: '20px',
        fontWeight: '400',
    },
    contentParagraph: {
        flex: '1 0 auto',
        color: '#A1A1A4',
        lineHeight: '16px',
    },
    contentLink: {
        cursor: 'pointer',
        textDecoration: 'inherit',
        color: 'inherit',
        fill: 'inherit',
        ':hover': {
            textDecoration: 'inherit',
            color: 'inherit',
            fill: 'inherit',
        },
        ':active': {
            textDecoration: 'inherit',
            color: 'inherit',
            fill: 'inherit',
        },
    },
});

const LodexResource = ({ link, title, description }) => (
    <div>
        <a className={css(styles.contentLink)} href={link}>
            <div className={css(styles.contentTitle)}>
                {title}
            </div>
            <div className={css(styles.contentParagraph)}>
                {description}
            </div>
        </a>
    </div>
);

LodexResource.propTypes = {
    link: PropTypes.string.isRequired, // eslint-disable-line
    title: PropTypes.string.isRequired, // eslint-disable-line
    description: PropTypes.string.isRequired, // eslint-disable-line
};

export default LodexResource;
