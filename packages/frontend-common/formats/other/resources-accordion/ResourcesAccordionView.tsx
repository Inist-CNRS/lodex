import compose from 'recompose/compose';
import { isLocalURL, getResourceUri } from '@lodex/common';

import ExpandableResourceCard from '../../utils/components/ExpandableResourceCard';
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

const styles = stylesToClassname(
    {
        list: {
            margin: '0',
            padding: '0',
            listStyle: 'none',
        },
    },
    'resources-accordion',
);

type Resource = {
    id?: string;
    url?: string;
    title?: string;
    summary?: string;
    similarity?: number;
};

interface ResourcesAccordionViewProps {
    data: Resource[];
    total: number;
    pageSize: number;
    openInNewTab: boolean;
    allowToLoadMore: boolean;
    filterFormatData(...args: unknown[]): unknown;
    params?: { minSimilarity?: number };
    showMinSimilarity?: boolean;
}

export const ResourcesAccordionView = ({
    data,
    total,
    pageSize,
    openInNewTab,
    allowToLoadMore,
    filterFormatData,
    params,
    showMinSimilarity,
}: ResourcesAccordionViewProps) => {
    const { isSimilarityMode, items, showMore, handleMore } =
        useResourcesPagination({
            data,
            total,
            pageSize,
            allowToLoadMore,
            filterFormatData,
        });

    return (
        <div>
            <MinSimilaritySentence
                classPrefix="resources-accordion"
                isSimilarityMode={isSimilarityMode}
                show={showMinSimilarity}
                minSimilarity={params?.minSimilarity}
            />
            {/*
            // @ts-expect-error TS2322 */}
            <div className={styles.list}>
                {items.map((entry, index) => {
                    const { id, url, title, summary } = entry;
                    if (!id) {
                        return null;
                    }
                    return (
                        <ExpandableResourceCard
                            // the id keeps a card's unfolded state with its resource;
                            // the index keeps keys unique if a routine repeats an id
                            key={`${id}-${index}`}
                            domId={id}
                            title={title || 'n/a'}
                            description={summary}
                            {...(isLocalURL(id)
                                ? { to: getResourceUri({ uri: id }) }
                                : { href: url })}
                            target={openInNewTab ? '_blank' : undefined}
                            afterDescription={() =>
                                hasSimilarity(entry) ? (
                                    <SimilarityDegree
                                        classPrefix="resources-accordion"
                                        similarity={entry.similarity}
                                    />
                                ) : null
                            }
                        />
                    );
                })}
            </div>
            {showMore && (
                <LoadMoreButton
                    classPrefix="resources-accordion"
                    isSimilarityMode={isSimilarityMode}
                    shown={items.length}
                    total={data.length}
                    onClick={handleMore}
                />
            )}
        </div>
    );
};

type FormatData = { items?: Resource[]; total?: number } | null | undefined;

// injectData passes the routine response as formatData
export const ResourcesAccordionFromFormatData = ({
    formatData,
    ...props
}: Omit<ResourcesAccordionViewProps, 'data' | 'total'> & {
    formatData?: FormatData;
}) => (
    <ResourcesAccordionView
        {...props}
        data={formatData?.items ?? []}
        total={formatData?.items ? formatData.total ?? 0 : 0}
    />
);

export default compose(
    // @ts-expect-error TS2345
    injectData(null, (field) => !!field, true),
    // @ts-expect-error TS2345
)(ResourcesAccordionFromFormatData);
