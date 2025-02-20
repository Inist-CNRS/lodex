import { useQuery } from '@tanstack/react-query';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { getRequest } from '../user';
import fetch from '../lib/fetch';
import { getFieldAnnotationIds } from './annotationStorage';

export const useGetFieldAnnotation = (fieldId, resourceUri) => {
    return useQuery({
        queryKey: ['field-annotations', fieldId, resourceUri],
        queryFn: async () => {
            const { token } = getUserSessionStorageInfo();
            const request = getRequest(
                { token },
                {
                    method: 'GET',
                    url: `/api/annotation/field-annotations?fieldId=${fieldId}${resourceUri ? `&resourceUri=${resourceUri}` : ''}`,
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

            const storedAnnotationIds = getFieldAnnotationIds({
                fieldId,
                resourceUri,
            });

            return response.map((annotation) => ({
                ...annotation,
                isMine: storedAnnotationIds.includes(annotation._id),
            }));
        },
    });
};
