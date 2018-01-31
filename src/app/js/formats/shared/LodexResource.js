import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite/no-important';
import { Link } from 'react-router';
import { getFullResourceUri } from '../../../../common/uris';

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
const LodexResource = ({ id, title, summary }) => (
    <div id={id}>
        <Link
            className={css(styles.contentLink)}
            to={getFullResourceUri({ uri: id })}
        >
            <div className={css(styles.contentTitle)}>{title}</div>
            <div className={css(styles.contentParagraph)}>{summary}</div>
        </Link>
    </div>
);

LodexResource.propTypes = {
    id: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    title: PropTypes.string,
    summary: PropTypes.string,
};

LodexResource.defaultProps = {
    title: 'n/a',
    summary: '',
};

export default LodexResource;
