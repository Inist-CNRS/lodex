import React from 'react';
import PropTypes from 'prop-types';
import Book from 'material-ui/svg-icons/av/library-books';
import { StyleSheet, css } from 'aphrodite/no-important';

const styles = StyleSheet.create({
    article: {
        paddingBottom: '3rem',
    },
    title: {
        lineHeight: '2rem',
        display: 'flex',
    },
    titleIcon: {
        marginRight: 8,
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
                <Book size="20" className={css(styles.titleIcon)} />
                <a style={styles.link} href={url}>
                    {title}
                </a>
            </div>
            {authors && (
                <div className={css(styles.authors)}> {authors.join(';')} </div>
            )}
            <div className={css(styles.metadata)}>
                {publicationDate},&nbsp;{hostTitle}
                &nbsp;-&nbsp;
                <span className={css(styles.genre)}>{hostGenre}</span>
            </div>
        </div>
    </article>
);

IstexItemComponent.propTypes = {
    title: PropTypes.string.isRequired,
    publicationDate: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    authors: PropTypes.arrayOf(PropTypes.string),
    hostTitle: PropTypes.string.isRequired,
    hostGenre: PropTypes.string.isRequired,
};

export default IstexItemComponent;
