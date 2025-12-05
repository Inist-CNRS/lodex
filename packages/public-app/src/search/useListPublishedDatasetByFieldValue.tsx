import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

const PAGE_SIZE = 10;

export function useListPublishedDatasetByFieldValue(
    filters: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { fetch } = useApiClient();

    const {
        isLoading: isListSearchResultPending,
        fetchNextPage: fetchMoreResults,
        data,
    } = useInfiniteQuery({
        queryKey: ['search', 'list', JSON.stringify(filters)],
        queryFn({ pageParam = 0 }) {
            if (!filters?.length) {
                return {
                    total: 0,
                    data: [],
                };
            }

            return fetch<PublishedDataByFieldResponse>({
                url: `/api/publishedDataset/search`,
                method: 'POST',
                body: JSON.stringify({
                    filters,
                    page: pageParam,
                    pageSize: PAGE_SIZE,
                }),
            });
        },
        getNextPageParam(_, allPages) {
            return allPages.length;
        },
    });

    return useMemo(
        () => ({
            isListSearchResultPending,
            totalSearchResult: (data?.pages ?? [])
                .map((page) => page.total)
                .reduce((a, b) => Math.max(a, b), 0),
            searchResult: (data?.pages ?? []).flatMap((page) => page.data),
            fetchMoreResults,
        }),
        [isListSearchResultPending, data, fetchMoreResults],
    );
}

export type UseListPublishedDatasetByFieldValueParams = SearchPaneFilter | null;

export type PublishedDataByFieldResponse = {
    total: number;
    data: {
        [key: string]: unknown;
        uri: string;
    }[];
};
