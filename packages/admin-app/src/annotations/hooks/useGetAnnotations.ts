import { useQuery } from '@tanstack/react-query';
import { omitBy } from 'lodash';
import qs from 'qs';
import { useHistory } from 'react-router-dom';

import fetch from '@lodex/frontend-common/fetch/fetch';
import { getRequest } from '../../../../../src/app/js/user';
import { getUserSessionStorageInfo } from '../../api/tools';

// @ts-expect-error TS7031
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
