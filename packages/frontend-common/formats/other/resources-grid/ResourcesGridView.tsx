import compose from 'recompose/compose';
import { connect } from 'react-redux';
import memoize from 'lodash/memoize';

import LodexResource from '../../utils/components/LodexResource';
import injectData from '../../injectData';
import stylesToClassname from '../../../utils/stylesToClassName';
import {
    LoadMoreButton,
    MinSimilaritySentence,
    SimilarityDegree,
} from '../resources-common/SimilarityParts';
import {
    hasSimilarity,
    useResourcesPagination,
} from '../resources-common/useResourcesPagination';
import { toItemsPerRow } from './ResourcesGridAdmin';

const createStyles = memoize((itemsPerRow: number) =>
    stylesToClassname(
        {
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
    const { isSimilarityMode, items, showMore, handleMore } =
        useResourcesPagination({
            data,
            total,
            pageSize: pageSizeArg,
            allowToLoadMore,
            filterFormatData,
        });
    const perRow = toItemsPerRow({ itemsPerRow, spaceWidth });
    const styles = createStyles(perRow);

    return (
        <div>
            <MinSimilaritySentence
                classPrefix="resources-grid"
                isSimilarityMode={isSimilarityMode}
                show={showMinSimilarity}
                minSimilarity={params?.minSimilarity}
            />
            {/*
            // @ts-expect-error TS2322 */}
            <ul className={styles.list}>
                {items.map((entry, index) => (
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
                                    hasSimilarity(entry) ? (
                                        <SimilarityDegree
                                            classPrefix="resources-grid"
                                            similarity={entry.similarity}
                                        />
                                    ) : undefined
                                }
                            />
                        </div>
                    </li>
                ))}
            </ul>
            {showMore && (
                <LoadMoreButton
                    classPrefix="resources-grid"
                    isSimilarityMode={isSimilarityMode}
                    shown={items.length}
                    total={data.length}
                    onClick={handleMore}
                />
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
