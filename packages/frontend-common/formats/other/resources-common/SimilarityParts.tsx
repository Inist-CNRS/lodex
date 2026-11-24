import { Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import memoize from 'lodash/memoize';

import stylesToClassname from '../../../utils/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';
import { formatSimilarity } from './similarity';

const createStyles = memoize((classPrefix: string) =>
    stylesToClassname(
        {
            // same grey as the field label
            minSimilarity: {
                color: grey[500],
                margin: '0 0 1em',
            },
            similarity: {
                marginTop: '1em',
                color: '#757575',
                fontSize: '13px',
                lineHeight: '16px',
                textAlign: 'left',
            },
            button: {
                display: 'flex',
                justifyContent: 'center',
                marginTop: '1em',
            },
        },
        classPrefix,
    ),
);

interface MinSimilaritySentenceProps {
    classPrefix: string;
    isSimilarityMode: boolean;
    show?: boolean;
    minSimilarity?: unknown;
}

export const MinSimilaritySentence = ({
    classPrefix,
    isSimilarityMode,
    show,
    minSimilarity,
}: MinSimilaritySentenceProps) => {
    const { translate, locale } = useTranslate();
    if (!isSimilarityMode || !show || typeof minSimilarity !== 'number') {
        return null;
    }
    const styles = createStyles(classPrefix);
    return (
        // @ts-expect-error TS2339
        <p className={styles.minSimilarity}>
            {translate('min_similarity_sentence')}{' '}
            <strong>{formatSimilarity(minSimilarity, locale)}</strong>
        </p>
    );
};

interface SimilarityDegreeProps {
    classPrefix: string;
    similarity: number;
}

export const SimilarityDegree = ({
    classPrefix,
    similarity,
}: SimilarityDegreeProps) => {
    const { translate, locale } = useTranslate();
    const styles = createStyles(classPrefix);
    return (
        // @ts-expect-error TS2322
        <div className={styles.similarity}>
            {translate('similarity_degree', {
                similarity: formatSimilarity(similarity, locale),
            })}
        </div>
    );
};

interface LoadMoreButtonProps {
    classPrefix: string;
    isSimilarityMode: boolean;
    shown: number;
    total: number;
    onClick(): void;
}

export const LoadMoreButton = ({
    classPrefix,
    isSimilarityMode,
    shown,
    total,
    onClick,
}: LoadMoreButtonProps) => {
    const { translate } = useTranslate();
    const styles = createStyles(classPrefix);
    return (
        // @ts-expect-error TS2322
        <div className={styles.button}>
            <Button variant="contained" onClick={onClick} startIcon={null}>
                {isSimilarityMode
                    ? translate('see_more_result_count', { shown, total })
                    : translate('see_more_result')}
            </Button>
        </div>
    );
};
