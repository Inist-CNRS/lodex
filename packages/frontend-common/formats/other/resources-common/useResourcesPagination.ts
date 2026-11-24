import { useState } from 'react';

import { toPageSize } from './pageSize';

export const hasSimilarity = (
    entry: unknown,
): entry is { similarity: number } =>
    typeof (entry as { similarity?: unknown } | null)?.similarity === 'number';

interface UseResourcesPaginationArgs<T> {
    data: T[];
    total: number;
    pageSize: unknown;
    allowToLoadMore: boolean;
    filterFormatData(args: { maxSize: number }): void;
}

export const useResourcesPagination = <T>({
    data,
    total,
    pageSize: pageSizeArg,
    allowToLoadMore,
    filterFormatData,
}: UseResourcesPaginationArgs<T>) => {
    // An invalid saved pageSize (null after the input was emptied) would show no item at all.
    const pageSize = toPageSize(pageSizeArg);
    const [more, setMore] = useState(pageSize);

    const isSimilarityMode = data.some(hasSimilarity);

    const handleMore = () => {
        const newMore = more + pageSize;
        setMore(newMore);
        if (!isSimilarityMode) {
            filterFormatData({ maxSize: newMore });
        }
    };

    const items =
        isSimilarityMode || allowToLoadMore ? data.slice(0, more) : data;
    // Pagination is local in similarity mode: the total is what was received.
    const showMore = isSimilarityMode
        ? items.length < data.length
        : allowToLoadMore && more < total;

    return { isSimilarityMode, items, showMore, handleMore };
};
