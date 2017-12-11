import React from 'react';
import PropTypes from 'prop-types';
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

// see https://jsonfeed.org/version/1#items
const LodexResource = ({ id, url, title, summary }) => (
    <div>
        <a id={id} className={css(styles.contentLink)} href={url}>
            <div className={css(styles.contentTitle)}>{title}</div>
            <div className={css(styles.contentParagraph)}>{summary}</div>
        </a>
    </div>
);

LodexResource.propTypes = {
    id: PropTypes.string.isRequired, // eslint-disable-line
    url: PropTypes.string.isRequired, // eslint-disable-line
    title: PropTypes.string, // eslint-disable-line
    summary: PropTypes.string, // eslint-disable-line
};

LodexResource.defaultProps = {
    title: 'n/a',
    summary: '',
};

export default LodexResource;
