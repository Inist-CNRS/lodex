import { useMutation } from '@tanstack/react-query';
import qs from 'qs';
import fetch from '../lib/fetch';
import { getLoginRequest, loginSuccess } from '../user';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { useDispatch } from 'react-redux';
import { useHistory, useLocation } from 'react-router';

const login = async ({
    username,
    password,
}: {
    username: string;
    password: string;
}) => {
    const { token } = getUserSessionStorageInfo();

    const request = getLoginRequest(
        { token },
        {
            password,
            username,
        },
    );

    return fetch(request).then(
        ({ error, response }: { error: Error | null; response: any }) => {
            if (error) {
                throw new Error(error.message);
            }
            return response;
        },
    );
};

export const useLogin = () => {
    const { search } = useLocation();
    const history = useHistory();
    const { page } = ((search && qs.parse(search.replace('?', ''))) || {}) as {
        page?: string;
    };
    const dispatch = useDispatch();

    const { mutate, error, isLoading } = useMutation({
        mutationFn: login,
        onSuccess: (response) => {
            console.log('SUCCESS');
            dispatch(loginSuccess(response));

            history.push(`${page && page.startsWith('/') ? page : '/'}`);
        },
    });

    return {
        login: mutate,
        error: error as Error | null,
        isLoading,
    };
};
