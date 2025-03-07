import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from '../../../common/tools/toast';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { useTranslate } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getRequest } from '../user';
import {
    useGetFieldAnnotationIds,
    useSetFieldAnnotationIds,
} from './annotationStorage';

export const useGetFieldAnnotation = (fieldId, resourceUri, enabled = true) => {
    const { translate } = useTranslate();
    const storedAnnotationIds = useGetFieldAnnotationIds({
        fieldId,
        resourceUri,
    });
    const setFieldAnnotationIds = useSetFieldAnnotationIds({
        fieldId,
        resourceUri,
    });

    const { data, isLoading, ...rest } = useQuery({
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

            return response.map((annotation) => ({
                ...annotation,
                isMine: storedAnnotationIds.includes(annotation._id),
            }));
        },
        enabled,
    });

    useEffect(() => {
        if (!data || isLoading || !enabled) {
            return;
        }

        const existingAnnotationIds = storedAnnotationIds.filter((id) =>
            data.some((annotation) => annotation._id === id),
        );

        if (existingAnnotationIds.length !== storedAnnotationIds.length) {
            setFieldAnnotationIds(existingAnnotationIds);

            toast(translate('annotation_deleted_by_admin'), {
                type: toast.TYPE.INFO,
            });
        }
    }, [
        data,
        isLoading,
        storedAnnotationIds,
        setFieldAnnotationIds,
        translate,
        enabled,
        fieldId,
    ]);

    return {
        ...rest,
        isLoading,
        data,
    };
};
