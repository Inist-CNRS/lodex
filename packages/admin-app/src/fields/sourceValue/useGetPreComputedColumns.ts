import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import { useQuery } from '@tanstack/react-query';

export const useGetPreComputedColumns = ({
    precomputedId,
}: {
    precomputedId: string | null | undefined;
}) => {
    const { fetch } = useApiClient();
    const { isLoading, data } = useQuery({
        queryKey: ['precomputed-columns', precomputedId],
        enabled: !!precomputedId,
        queryFn: async () => {
            return fetch<{
                columns: {
                    key: string;
                    type: string;
                }[];
            }>({
                url: `/api/precomputed/${precomputedId}/result/columns`,
            }).then((data) => data.columns.map(({ key }) => key));
        },
    });

    return {
        isLoadingPrecomputedColumns: isLoading,
        precomputedFieldNames: data ?? [],
    };
};
