import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { fromFacet } from '../selectors';

const PAGE_SIZE = 10;

export function useListPublishedDatasetByFieldValue(
    filters: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { fetch } = useApiClient();
    const facets: Record<
        string,
        { value: string; count: number; id: string }[]
    > = useSelector(fromFacet('dataset').getAppliedFacets);

    const filtersWithFacets = useMemo(() => {
        if (!facets || Object.keys(facets).length === 0) {
            return filters;
        }
        const facetFilters = Object.entries(facets).flatMap(
            ([fieldName, values]) =>
                values.map((v) => ({
                    fieldName,
                    value: v.value,
                })),
        );
        return filters ? [...filters, ...facetFilters] : facetFilters;
    }, [filters, facets]);

    const {
        isLoading: isListSearchResultPending,
        fetchNextPage: fetchMoreResults,
        data,
    } = useInfiniteQuery({
        queryKey: ['search', 'list', JSON.stringify(filtersWithFacets)],
        queryFn({ pageParam = 0 }) {
            if (!filtersWithFacets?.length) {
                return {
                    total: 0,
                    data: [],
                };
            }

            return fetch<PublishedDataByFieldResponse>({
                url: `/api/publishedDataset/search`,
                method: 'POST',
                body: JSON.stringify({
                    filters: filtersWithFacets,
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
