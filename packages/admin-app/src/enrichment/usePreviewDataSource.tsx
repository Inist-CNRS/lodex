import type { DataSource } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function usePreviewDataSource({
    dataSource,
    sourceColumn,
    subPath,
}: UsePreviewDataSourceParams) {
    const { fetch } = useApiClient();

    const { isLoading, data } = useQuery({
        queryKey: ['dataSource', 'preview', dataSource?.id],
        async queryFn() {
            if (!dataSource) {
                return [];
            }

            return fetch<Record<string, unknown>[]>({
                url: `/api/dataSource/${dataSource.id}/preview`,
            });
        },
    });

    const previewData = useMemo(() => {
        return (
            data?.map((row) => {
                if (sourceColumn) {
                    if (
                        subPath &&
                        typeof row[sourceColumn] === 'object' &&
                        row[sourceColumn] !== null
                    ) {
                        return (row[sourceColumn] as Record<string, unknown>)[
                            subPath
                        ];
                    }

                    return row[sourceColumn] as Record<string, unknown>;
                }

                return row;
            }) ?? []
        );
    }, [data, sourceColumn, subPath]);

    return useMemo(
        () => ({
            isPreviewPending: isLoading,
            previewData,
        }),
        [isLoading, previewData],
    );
}

type UsePreviewDataSourceParams = {
    dataSource?: DataSource;
    sourceColumn?: string;
    subPath?: string;
};
