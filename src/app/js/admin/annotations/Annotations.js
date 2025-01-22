import React from 'react';
import { useGetAnnotations } from './useGetAnnotations';
import Loading from '../../lib/components/Loading';
import { useTranslate } from '../../i18n/I18NContext';
import { DataGrid } from '@mui/x-data-grid';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import { ResourceCell } from './ResourceCell';

export const Annotations = () => {
    const { translate } = useTranslate();
    const { isPending, error, data, isFetching } = useGetAnnotations();

    if (isPending || isFetching) {
        return <Loading>{translate('loading')}</Loading>;
    }

    if (error) {
        console.error(error);
        return <AdminOnlyAlert>{translate('annotation_error')}</AdminOnlyAlert>;
    }

    return (
        <DataGrid
            columns={[
                {
                    field: 'comment',
                    headerName: translate('annotation.comment'),
                    flex: 1,
                },
                {
                    field: 'resource',
                    headerName: translate('annotation.resource'),
                    flex: 1,
                    renderCell: ({ value }) => {
                        return <ResourceCell resource={value} />;
                    },
                },
                {
                    field: 'createdAt',
                    headerName: translate('annotation.createdAt'),
                    flex: 1,
                    renderCell: ({ value }) => {
                        return new Date(value).toLocaleString();
                    },
                },
            ]}
            rows={data?.data}
            getRowId={({ _id }) => _id}
        >
            SOON
        </DataGrid>
    );
};
