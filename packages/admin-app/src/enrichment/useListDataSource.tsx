import type { DataSource } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useQuery } from '@tanstack/react-query';
import { useCallback, useMemo } from 'react';

export function useListDataSource() {
    const { fetch } = useApiClient();

    const { isLoading, data, error } = useQuery({
        queryKey: ['dataSource', 'list'],
        async queryFn() {
            return fetch<DataSource[]>({
                url: '/api/dataSource',
            });
        },
    });

    const dataSources = useMemo(() => data ?? [], [data]);

    const getDataSourceById = useCallback(
        (id: string) => {
            return dataSources.find((ds) => ds.id === id);
        },
        [dataSources],
    );

    const getDataSourceLabel = useCallback(
        (id: string) => {
            return getDataSourceById(id)?.name || id;
        },
        [getDataSourceById],
    );

    return useMemo(
        () => ({
            isDataSourceListPending: isLoading,
            dataSources: dataSources.map(({ id }) => id),
            error,

            getDataSourceById,
            getDataSourceLabel,
        }),
        [isLoading, dataSources, error, getDataSourceById, getDataSourceLabel],
    );
}
