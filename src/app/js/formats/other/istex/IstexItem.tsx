// @ts-expect-error TS6133
import React from 'react';
import PropTypes from 'prop-types';
import Book from '@mui/icons-material/LibraryBooks';

import Link from '../../../lib/components/Link';
import stylesToClassname from '../../../lib/stylesToClassName';

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
    // @ts-expect-error TS7031
    title,
    // @ts-expect-error TS7031
    publicationDate,
    // @ts-expect-error TS7031
    url,
    // @ts-expect-error TS7031
    authors,
    // @ts-expect-error TS7031
    hostTitle,
    // @ts-expect-error TS7031
    hostGenre,
    // @ts-expect-error TS7031
    hostPagesFirst,
    // @ts-expect-error TS7031
    hostPagesLast,
    // @ts-expect-error TS7031
    hostVolume,
    // @ts-expect-error TS7031
    hostIssue,
}) => (
    <article>
        {/*
         // @ts-expect-error TS2339 */}
        <div className={styles.article}>
            {/*
             // @ts-expect-error TS2339 */}
            <div className={styles.title}>
                {/*
                 // @ts-expect-error TS2769 */}
                <Book size="20" className={styles.titleIcon} />
                {/*
                 // @ts-expect-error TS2739 */}
                <Link href={url} target="_blank">
                    {title}
                </Link>
            </div>
            {authors && (
                // @ts-expect-error TS2339
                <div className={styles.authors}> {authors.join(', ')} </div>
            )}
            {/*
             // @ts-expect-error TS2339 */}
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
                {/*
                 // @ts-expect-error TS2339 */}
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
