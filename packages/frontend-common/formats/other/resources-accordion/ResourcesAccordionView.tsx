import { useMemo } from 'react';
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

type LinkedResource = Resource & { id: string };

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
    // A resource without id has no card: leave it out of the counts too.
    const resources = useMemo(
        () => data.filter((entry): entry is LinkedResource => !!entry.id),
        [data],
    );
    const { isSimilarityMode, items, showMore, handleMore } =
        useResourcesPagination({
            data: resources,
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
            <ul className={styles.list}>
                {items.map((entry, index) => {
                    const { id, url, title, summary } = entry;
                    return (
                        // the id keeps a card's unfolded state with its resource;
                        // the index keeps keys unique if a routine repeats an id
                        <li key={`${id}-${index}`}>
                            <ExpandableResourceCard
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
                        </li>
                    );
                })}
            </ul>
            {showMore && (
                <LoadMoreButton
                    classPrefix="resources-accordion"
                    isSimilarityMode={isSimilarityMode}
                    shown={items.length}
                    total={resources.length}
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
