import type { DataSource } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function usePreviewDataSource({
    dataSource,
    ...rest
}: UsePreviewDataSourceParams) {
    const { fetch } = useApiClient();

    const { isLoading, data: previewData } = useQuery<
        Record<string, unknown>[],
        unknown
    >({
        queryKey: [
            'dataSource',
            'preview',
            dataSource?.id,
            JSON.stringify(rest),
        ],
        async queryFn() {
            if (!dataSource) {
                return [];
            }

            return fetch({
                url: '/api/dataSource/preview',
                method: 'POST',
                body: JSON.stringify({ dataSource: dataSource.id, ...rest }),
            });
        },
    });

    return useMemo(
        () => ({
            isPreviewPending: isLoading,
            previewData: previewData ?? [],
        }),
        [isLoading, previewData],
    );
}

export type UsePreviewDataSourceParams = {
    dataSource?: DataSource;

    sourceColumn?: string;
    subPath?: string;

    rule?: string;
};
