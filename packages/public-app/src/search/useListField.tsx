import { Overview } from '@lodex/common';
import { useApiClient } from '@lodex/frontend-common/api/useApiClient';
import type { Field } from '@lodex/frontend-common/fields/types';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useListField() {
    const { fetch } = useApiClient();

    const { isLoading: isFieldListPending, data: fields = [] } = useQuery({
        queryKey: ['field', 'list'],
        queryFn: async () => {
            return fetch<Field[]>({
                url: '/api/field',
                method: 'GET',
            });
        },
    });

    return useMemo(
        () => ({
            isFieldListPending,
            fields,
            fieldNames: {
                uri: 'uri',
                title: fields.find(
                    (f) => f.overview === Overview.RESOURCE_TITLE,
                )?.name,
                description: fields.find(
                    (f) => f.overview === Overview.RESOURCE_DESCRIPTION,
                )?.name,
                detail1: fields.find(
                    (f) => f.overview === Overview.RESOURCE_DETAIL_1,
                )?.name,
                detail2: fields.find(
                    (f) => f.overview === Overview.RESOURCE_DETAIL_2,
                )?.name,
                detail3: fields.find(
                    (f) => f.overview === Overview.RESOURCE_DETAIL_3,
                )?.name,
            } satisfies FieldNames,
        }),
        [isFieldListPending, fields],
    );
}

type FieldNames = {
    uri: string;
    title?: string;
    description?: string;
    detail1?: string;
    detail2?: string;
    detail3?: string;
};
