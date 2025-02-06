import { useQuery } from '@tanstack/react-query';
import qs from 'qs';
import fetch from '../../lib/fetch';
import { getUserSessionStorageInfo } from '../api/tools';
import { getRequest } from '../../user';
import { omitBy } from 'lodash';
import { useHistory } from 'react-router-dom';

export function useGetAnnotations({ page, perPage, sortBy, sortDir, filter }) {
    const history = useHistory();
    return useQuery({
        queryKey: ['get-annotations', page, perPage, sortBy, sortDir, filter],
        queryFn: async () => {
            const query = qs.stringify(
                omitBy(
                    {
                        page,
                        perPage,
                        sortBy,
                        sortDir,
                        ...filter,
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

            if (error?.code === 401) {
                history.push('/login');
                return;
            }

            if (error) {
                throw error;
            }

            return response;
        },
    });
}
