import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useApiClient } from '../../api/useApiClient';
import type { Field } from '../types';

export function useListFields() {
    const { fetch } = useApiClient();

    const { isLoading, data, error } = useQuery({
        queryKey: ['fields', 'list'],
        queryFn: async () => {
            return fetch<Field[]>({
                url: '/api/field',
            });
        },
    });

    return useMemo(
        () => ({
            isListFieldPending: isLoading,
            fields: data ?? [],
            listFieldError: error,
        }),
        [isLoading, data, error],
    );
}
