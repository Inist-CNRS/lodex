import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';
import { omitBy } from 'lodash';

export function useGetAnnotations({
    page,
    perPage,
    sortBy,
    sortDir,
    filterBy,
    filterOperator,
    filterValue,
}) {
    return useQuery({
        queryKey: [
            'get-annotations',
            page,
            perPage,
            sortBy,
            sortDir,
            filterBy,
            filterOperator,
            filterValue,
        ],
        queryFn: async () => {
            const query = qs.stringify(
                omitBy(
                    {
                        page,
                        perPage,
                        sortBy,
                        sortDir,
                        filterBy,
                        filterOperator,
                        filterValue,
                    },
                    (value) => value === null || value === '',
                ),
            );

            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/annotation?${query}`,
                },
            );
            const { response, error } = await fetch(request);

            if (error) {
                throw error;
            }

            return response;
        },
    });
}
