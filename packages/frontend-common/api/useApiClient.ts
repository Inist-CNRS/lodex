import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router';
import internalFetch from '../fetch/fetch';
import { getUserSessionStorageInfo } from '../getUserSessionStorageInfo';

const LOGIN_URL = '/login';

export function useApiClient() {
    const history = useHistory();

    const fetch = useCallback(
        async <T = unknown>(
            {
                body,
                method = 'GET',
                url,
                credentials = 'same-origin',
                head = {
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
            }: RequestProps,
            mode: 'json' | 'blob' | 'stream' = 'json',
        ) => {
            const { token } = getUserSessionStorageInfo();

            const { response, error } = await internalFetch(
                {
                    url,
                    body,
                    credentials,
                    headers: {
                        ...head,
                        Authorization: token ? `Bearer ${token}` : undefined,
                    },
                    method,
                },
                mode,
            );

            if (error) {
                if (error?.code === 401) {
                    history.push(LOGIN_URL);
                    throw new Error('unauthorized');
                }
                throw error;
            }
            return response as T;
        },
        [history],
    );

    return useMemo(() => ({ fetch }), [fetch]);
}

export type RequestProps = {
    body?: unknown;
    method?: string;
    url: string;
    credentials?: RequestCredentials;
    cook?: boolean;
    auth?: boolean;
    head?: Record<string, unknown>;
    cred?: RequestCredentials;
};
