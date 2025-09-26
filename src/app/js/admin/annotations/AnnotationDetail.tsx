import React from 'react';
import { Redirect } from 'react-router';
import { useRouteMatch } from 'react-router-dom';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import Loading from '../../lib/components/Loading';
import withInitialData from '../withInitialData';
import { AnnotationForm } from './details/AnnotationForm';
import { useGetAnnotation } from './hooks/useGetAnnotation';

export function AnnotationDetail() {
    const match = useRouteMatch();
    const { translate } = useTranslate();
    const {
        data: annotation,
        error,
        isLoading,
    } = useGetAnnotation(match.params.annotationId);

    if (isLoading) {
        return <Loading>{translate('loading')}</Loading>;
    }

    if (error) {
        console.error(error);
        return (
            <AdminOnlyAlert>
                {translate('annotation_query_error')}
            </AdminOnlyAlert>
        );
    }

    if (!annotation) {
        return <Redirect to="/annotations" />;
    }

    return <AnnotationForm annotation={annotation} />;
}

export default withInitialData(AnnotationDetail, true);
