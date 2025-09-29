import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
// @ts-expect-error TS7016
import { toast } from '../../../common/tools/toast';
import { getUserSessionStorageInfo } from '../admin/api/tools';
import { useTranslate } from '../i18n/I18NContext';
import fetch from '../lib/fetch';
import { getRequest } from '../user';
import {
    useGetFieldAnnotationIds,
    useSetFieldAnnotationIds,
} from './annotationStorage';

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
