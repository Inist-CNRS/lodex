import { useQuery } from '@tanstack/react-query';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { getRequest } from '../user';
import fetch from '../lib/fetch';
import {
    useGetFieldAnnotationIds,
    useSetFieldAnnotationIds,
} from './annotationStorage';
import { toast } from '../../../common/tools/toast';
import { useTranslate } from '../i18n/I18NContext';

export const useGetFieldAnnotation = (fieldId, resourceUri) => {
    const { translate } = useTranslate();
    const storedAnnotationIds = useGetFieldAnnotationIds({
        fieldId,
        resourceUri,
    });
    const setFieldAnnotationIds = useSetFieldAnnotationIds({
        fieldId,
        resourceUri,
    });
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

            const existingAnnotationIds = storedAnnotationIds.filter((id) =>
                response.some((annotation) => annotation._id === id),
            );

            if (existingAnnotationIds.length !== storedAnnotationIds.length) {
                setFieldAnnotationIds(existingAnnotationIds);

                toast(translate('annotation_deleted_by_admin'), {
                    type: toast.TYPE.INFO,
                });
            }

            return response.map((annotation) => ({
                ...annotation,
                isMine: storedAnnotationIds.includes(annotation._id),
            }));
        },
    });
};
