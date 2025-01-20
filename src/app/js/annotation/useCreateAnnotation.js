import { useMutation } from '@tanstack/react-query';
import { useMemo } from 'react';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import fetch from '../lib/fetch';
import { getRequest } from '../user';

export function useCreateAnnotation() {
    const mutation = useMutation({
        mutationFn: async (newTodo) => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    url: '/annotation',
                    body: JSON.stringify(newTodo),
                },
            );
            const response = await fetch(request);

            if (!response.ok) {
                throw new Error('Failed to create annotation');
            }

            return response.json();
        },
    });

    return useMemo(() => {}, []);
}
