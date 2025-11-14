import type { SearchPaneFilter } from '@lodex/frontend-common/search/SearchPaneContext';
import { useMemo } from 'react';
import { useListField } from './useListField';
import { useListPublishedDatasetByFieldValue } from './useListPublishedDatasetByFieldValue';

export function useListSearchResult(
    filter: UseListPublishedDatasetByFieldValueParams = null,
) {
    const { isFieldListPending, fields, fieldNames } = useListField();

    const { isListSearchResultPending, totalSearchResult, searchResult } =
        useListPublishedDatasetByFieldValue(filter);

    return useMemo(
        () => ({
            isListSearchResultPending:
                isFieldListPending || isListSearchResultPending,
            totalSearchResult,
            searchResult,
            fields,
            fieldNames,
        }),
        [
            isFieldListPending,
            fields,
            fieldNames,
            isListSearchResultPending,
            totalSearchResult,
            searchResult,
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
