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

export type IstexItemComponentProps = {
    title: string;
    publicationDate: string;
    url: string;
    authors?: string[];
    hostTitle: string;
    hostGenre: string;
    hostPagesFirst?: string;
    hostPagesLast?: string;
    hostVolume: string;
    hostIssue?: string;
};

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
}: IstexItemComponentProps) => (
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

export default IstexItemComponent;
