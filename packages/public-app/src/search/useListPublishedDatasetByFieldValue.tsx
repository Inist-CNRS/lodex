import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useListPublishedDatasetByFieldValue(
    filters: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { fetch } = useApiClient();

    const { isLoading: isListSearchResultPending, data: searchResult } =
        useQuery({
            queryKey: ['search', 'list', JSON.stringify(filters)],
            queryFn: async () => {
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
                    }),
                });
            },
        });

    return useMemo(
        () => ({
            isListSearchResultPending,
            totalSearchResult: searchResult?.total ?? 0,
            searchResult: searchResult?.data ?? [],
        }),
        [isListSearchResultPending, searchResult],
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
