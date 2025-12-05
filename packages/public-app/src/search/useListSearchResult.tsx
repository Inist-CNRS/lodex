import { useListField } from '@lodex/frontend-common/fields/api/useListField';
import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useMemo } from 'react';
import { useListPublishedDatasetByFieldValue } from './useListPublishedDatasetByFieldValue';

export function useListSearchResult(
    filters: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { isFieldListPending, fields, fieldNames } = useListField();

    const {
        isListSearchResultPending,
        totalSearchResult,
        searchResult,
        fetchMoreResults,
    } = useListPublishedDatasetByFieldValue(filters);

    return useMemo(
        () => ({
            isListSearchResultPending:
                isFieldListPending || isListSearchResultPending,
            totalSearchResult,
            searchResult,
            fields,
            fieldNames,
            fetchMoreResults,
        }),
        [
            isFieldListPending,
            fields,
            fieldNames,
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
