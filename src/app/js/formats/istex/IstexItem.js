import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, css } from 'aphrodite';

const styles = StyleSheet.create({
    article: {
        paddingBottom: '3rem',
    },
    title: {
        lineHeight: '2rem',
    },
    link: {
        fontSize: '2rem',
    },
    authors: {
        fontStyle: 'oblique',
    },
    metadata: {
        lineHeight: '1.5rem',
        color: '#757575',
    },
});

export const IstexItemComponent = ({
    title,
    publicationDate,
    url,
    authors,
    hostTitle,
    hostGenre,
}) => (
    <article>
        <div className={css(styles.article)}>
            <div className={css(styles.title)}>
                <a className={css(styles.link)} href={url} rel="noopener noreferrer">
                    {title}
                </a>
            </div>
            <div className={css(styles.authors)}> {authors} </div>
            <div className={css(styles.metadata)}>
                {publicationDate},&nbsp;{hostTitle} - {hostGenre}
            </div>
        </div>
    </article>
);

IstexItemComponent.propTypes = {
    title: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    authors: PropTypes.string.isRequired,
    hostTitle: PropTypes.string.isRequired,
    hostGenre: PropTypes.string.isRequired,
};

export default IstexItemComponent;
