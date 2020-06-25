import React from 'react';
import PropTypes from 'prop-types';
import Book from 'material-ui/svg-icons/av/library-books';

import Link from '../../lib/components/Link';
import stylesToClassname from '../../lib/stylesToClassName';

const styles = stylesToClassname(
    {
        article: {
            paddingBottom: '2rem',
        },
        title: {
            lineHeight: '1.25rem',
            display: 'flex',
        },
        titleIcon: {
            marginRight: 8,
            flexShrink: 0,
        },
        authors: {
            fontStyle: 'oblique',
        },
        metadata: {
            lineHeight: '1rem',
            color: '#757575',
        },
        genre: {
            textTransform: 'capitalize',
        },
    },
    'istex-item',
);

export const IstexItemComponent = ({
    title,
    publicationDate,
    url,
    authors,
    hostTitle,
    hostGenre,
    hostPagesFirst,
    hostPagesLast,
    hostVolume,
    hostIssue,
}) => (
    <article>
        <div className={styles.article}>
            <div className={styles.title}>
                <Book size="20" className={styles.titleIcon} />
                <Link href={url}>{title}</Link>
            </div>
            {authors && (
                <div className={styles.authors}> {authors.join(';')} </div>
            )}
            <div className={styles.metadata}>
                {publicationDate}
                ,&nbsp;
                {hostTitle}
                {hostVolume && (
                    <>
                        ,&nbsp;vol.&nbsp;
                        {hostVolume}
                    </>
                )}
                {hostIssue && (
                    <>
                        ,&nbsp;n°
                        {hostIssue}
                    </>
                )}
                {(hostPagesFirst || hostPagesFirst) && (
                    <>
                        ,&nbsp;pp.&nbsp;
                        {hostPagesFirst}-{hostPagesLast}
                    </>
                )}
                &nbsp;
                <span className={styles.genre}>({hostGenre})</span>
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
    hostPagesFirst: PropTypes.string,
    hostPagesLast: PropTypes.string,
    hostVolume: PropTypes.string.isRequired,
    hostIssue: PropTypes.string,
};

export default IstexItemComponent;
