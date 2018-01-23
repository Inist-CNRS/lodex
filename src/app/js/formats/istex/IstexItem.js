import React from 'react';
import PropTypes from 'prop-types';

const styles = {
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
    genre: {
        textTransform: 'capitalize',
    },
};

export const IstexItemComponent = ({
    title,
    publicationDate,
    url,
    authors,
    hostTitle,
    hostGenre,
}) => (
    <article>
        <div style={styles.article}>
            <div style={styles.title}>
                <a style={styles.link} href={url} rel="noopener noreferrer">
                    {title}
                </a>
            </div>
            <div style={styles.authors}> {authors} </div>
            <div style={styles.metadata}>
                {publicationDate},&nbsp;{hostTitle}
                &nbsp;-&nbsp;
                <span style={styles.genre}>{hostGenre}</span>
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
