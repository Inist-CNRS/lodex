import type { Precomputed, TaskStatusType } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useQuery } from '@tanstack/react-query';

export const useFetchPrecomputations = () => {
    const { fetch } = useApiClient();
    const { data, error, isLoading } = useQuery(
        ['fetchPrecomputations'],
        async () => {
            const response = await fetch<
                {
                    _id: string;
                    name: string;
                    status: Precomputed['status'];
                }[]
            >({
                url: `/api/precomputed`,
            });

            // Fetch precomputations from API
            return response.map(
                ({
                    name,
                    _id,
                    status,
                }: {
                    name: string;
                    _id: string;
                    status: TaskStatusType | undefined | '';
                }) => ({
                    name,
                    id: _id,
                    status,
                }),
            );
        },
    );

    return {
        precomputations: data,
        isPrecomputationsLoading: isLoading,
        precomputationsError: error,
    };
};
