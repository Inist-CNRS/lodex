import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { toast } from '@lodex/common';
import { getUserSessionStorageInfo } from '@lodex/frontend-common/getUserSessionStorageInfo';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import fetch from '@lodex/frontend-common/fetch/fetch';
import {
    useGetFieldAnnotationIds,
    useSetFieldAnnotationIds,
} from './annotationStorage';
import { getRequest } from '@lodex/frontend-common/user/reducer';

// @ts-expect-error TS7006
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
                // @ts-expect-error TS2339
                history.push('/login');
                return;
            }

            if (error) {
                throw error;
            }

            // @ts-expect-error TS7006
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

        // @ts-expect-error TS7006
        const existingAnnotationIds = storedAnnotationIds.filter((id) =>
            // @ts-expect-error TS7006
            data.some((annotation) => annotation._id === id),
        );

        if (existingAnnotationIds.length !== storedAnnotationIds.length) {
            setFieldAnnotationIds(existingAnnotationIds);

            toast(translate('annotation_deleted_by_admin'), {
                type: 'info',
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
