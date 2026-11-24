import { useState } from 'react';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import { Button } from '@mui/material';
import { grey } from '@mui/material/colors';
import memoize from 'lodash/memoize';

import LodexResource from '../../utils/components/LodexResource';
import injectData from '../../injectData';
import stylesToClassname from '../../../utils/stylesToClassName';
import { useTranslate } from '../../../i18n/I18NContext';
import { formatSimilarity } from './similarity';
import { toItemsPerRow, toPageSize } from './ResourcesGridAdmin';

const createStyles = memoize((itemsPerRow: number) =>
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
            list: {
                display: 'flex',
                flexWrap: 'wrap',
                margin: '0',
                padding: '0',
                listStyle: 'none',
            },
            item: {
                listStyle: 'none',
                display: 'flex',
                padding: '0.5em',
                width: '100%',
                borderRadius: '2px',
                background: 'white',
                boxShadow: '0 2px 1px rgba(170, 170, 170, 0.25)',
                '@media all and (min-width: 40em)': {
                    width: itemsPerRow === 1 ? '100%' : '50%',
                    margin: '0',
                },
                '@media all and (min-width: 60em)': {
                    // minus the 1% margin on each side
                    width: `calc(${100 / itemsPerRow}% - 2%)`,
                    margin: '1%',
                },
            },
            content: {
                backgroundColor: '#fff',
                display: 'flex',
                flexDirection: 'column',
                padding: '1em',
                width: '100%',
            },
        },
        'resources-grid',
    ),
);

interface ResourcesGridViewProps {
    field: unknown;
    data: object[];
    total: number;
    pageSize: number;
    titleSize: number;
    summarySize: number;
    openInNewTab: boolean;
    itemsPerRow?: number;
    spaceWidth?: string;
    filterFormatData(...args: unknown[]): unknown;
    allowToLoadMore: boolean;
    params?: { minSimilarity?: number };
    showMinSimilarity?: boolean;
}

export const ResourcesGridView = ({
    field: _field,
    data,
    total,
    pageSize: pageSizeArg,
    titleSize,
    summarySize,
    openInNewTab,
    itemsPerRow,
    spaceWidth,
    filterFormatData,
    allowToLoadMore,
    params,
    showMinSimilarity,
}: ResourcesGridViewProps) => {
    const { translate, locale } = useTranslate();
    // An invalid saved pageSize (null after the input was emptied) would show no card at all.
    const pageSize = toPageSize(pageSizeArg);
    const [more, setMore] = useState(pageSize);

    const isSimilarityMode = data.some(
        (entry) =>
            typeof (entry as { similarity?: unknown }).similarity === 'number',
    );

    const handleMore = () => {
        const newMore = more + pageSize;
        setMore(newMore);
        if (!isSimilarityMode) {
            filterFormatData({ maxSize: newMore });
        }
    };

    const perRow = toItemsPerRow({ itemsPerRow, spaceWidth });
    const styles = createStyles(perRow);
    const filteredData =
        isSimilarityMode || allowToLoadMore ? data.slice(0, more) : data;
    const minSimilarity = params?.minSimilarity;
    const showSentence =
        isSimilarityMode &&
        showMinSimilarity &&
        typeof minSimilarity === 'number';
    // Pagination is local in similarity mode: the total is what was received.
    const showMore = isSimilarityMode
        ? filteredData.length < data.length
        : allowToLoadMore && more < total;

    return (
        <div>
            {showSentence && (
                // @ts-expect-error TS2339
                <p className={styles.minSimilarity}>
                    {translate('min_similarity_sentence')}{' '}
                    <strong>{formatSimilarity(minSimilarity, locale)}</strong>
                </p>
            )}
            {/*
            // @ts-expect-error TS2322 */}
            <ul className={styles.list}>
                {filteredData.map((entry, index) => (
                    <li
                        key={`${index}-resources-grid`}
                        // stable hook for themes: the generated class names change with the width
                        data-items-per-row={perRow}
                        // @ts-expect-error TS2322
                        className={styles.item}
                    >
                        {/*
                        // @ts-expect-error TS2322 */}
                        <div className={styles.content}>
                            <LodexResource
                                {...entry}
                                titleSize={titleSize}
                                summarySize={summarySize}
                                openInNewTab={openInNewTab}
                                footer={
                                    typeof (entry as { similarity?: unknown })
                                        .similarity === 'number' ? (
                                        // @ts-expect-error TS2322
                                        <div className={styles.similarity}>
                                            {translate('similarity_degree', {
                                                similarity: formatSimilarity(
                                                    (
                                                        entry as {
                                                            similarity: number;
                                                        }
                                                    ).similarity,
                                                    locale,
                                                ),
                                            })}
                                        </div>
                                    ) : undefined
                                }
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {showMore && (
                // @ts-expect-error TS2322
                <div className={styles.button}>
                    <Button
                        variant="contained"
                        onClick={handleMore}
                        startIcon={null}
                    >
                        {isSimilarityMode
                            ? translate('see_more_result_count', {
                                  shown: filteredData.length,
                                  total: data.length,
                              })
                            : translate('see_more_result')}
                    </Button>
                </div>
            )}
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (_, { formatData }) => {
    if (!formatData || !formatData.items) {
        return {
            data: [],
            total: 0,
        };
    }

    return {
        data: formatData.items,
        total: formatData.total,
    };
};

export default compose(
    // @ts-expect-error TS2345
    injectData(null, (field) => !!field, true),
    connect(mapStateToProps),
    // @ts-expect-error TS2345
)(ResourcesGridView);
