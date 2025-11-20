import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useListPublishedDatasetByFieldValue(
    filter: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { fetch } = useApiClient();

    const { isLoading: isListSearchResultPending, data: searchResult } =
        useQuery({
            queryKey: ['search', 'list', filter?.field, filter?.value],
            queryFn: async () => {
                if (!filter) {
                    return {
                        total: 0,
                        data: [],
                    };
                }

                return fetch<PublishedDataByFieldResponse>({
                    url: `/api/publishedDataset/field/${filter.field}`,
                    method: 'POST',
                    body: JSON.stringify({
                        value: filter.value,
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
