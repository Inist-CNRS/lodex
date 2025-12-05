import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';

const defaultResults: PublishedDataByFieldResponse['data'] = [];

const PAGE_SIZE = 10;

export function useListPublishedDatasetByFieldValue(
    filters: UseListPublishedDatasetByFieldValueParams = null,
) {
    const [totalSearchResult, setSearchTotalResult] = useState<number>(0);
    const [searchResult, setSearchResult] =
        useState<PublishedDataByFieldResponse['data']>(defaultResults);

    const { fetch } = useApiClient();

    const { isLoading: isListSearchResultPending, mutateAsync } = useMutation<
        PublishedDataByFieldResponse,
        unknown,
        number
    >({
        mutationKey: ['search', 'list', JSON.stringify(filters)],
        async mutationFn(page = 0) {
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
                    page,
                    pageSize: PAGE_SIZE,
                }),
            });
        },
    });

    useEffect(() => {
        if (!filters?.length) {
            setSearchTotalResult(0);
            setSearchResult(defaultResults);
            return;
        }

        mutateAsync(0).then(({ total, data }) => {
            setSearchTotalResult(total);
            setSearchResult(data);
        });
    }, [filters, mutateAsync]);

    const fetchMoreResults = useCallback(async () => {
        if (!filters?.length || searchResult.length >= totalSearchResult) {
            return;
        }

        const nextPage = Math.floor(searchResult.length / 10);
        const { data } = await mutateAsync(nextPage);

        setSearchResult((prevResults) => [...prevResults, ...data]);
    }, [mutateAsync, filters, searchResult, totalSearchResult]);

    return useMemo(
        () => ({
            isListSearchResultPending,
            totalSearchResult,
            searchResult,
            fetchMoreResults,
        }),
        [
            isListSearchResultPending,
            totalSearchResult,
            searchResult,
            fetchMoreResults,
        ],
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
