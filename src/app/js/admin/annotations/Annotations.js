import React, { useState } from 'react';
import { useGetAnnotations } from './useGetAnnotations';
import { useTranslate } from '../../i18n/I18NContext';
import { DataGrid, getGridStringOperators } from '@mui/x-data-grid';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import { ResourceCell } from './ResourceCell';

export const Annotations = () => {
    const { translate } = useTranslate();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(25);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [filterBy, setFilterBy] = useState(null);
    const [filterOperator, setFilterOperator] = useState(null);
    const [filterValue, setFilterValue] = useState(null);
    const { isPending, error, data, isFetching } = useGetAnnotations({
        page,
        perPage,
        sortDir,
        sortBy,
        filterBy,
        filterOperator,
        filterValue,
    });

    const onPageChange = (page) => {
        setPage(page);
    };
    const handleSortModelChange = (sortModel) => {
        setSortBy(sortModel[0]?.field);
        setSortDir(sortModel[0]?.sort);
    };

    const handleFilterModelChange = (filterModel) => {
        if (filterModel.items.length === 0) {
            setFilterBy(null);
            setFilterOperator(null);
            setFilterValue(null);
            return;
        }
        const { columnField, operatorValue, value } = filterModel.items[0];
        setFilterBy(columnField);
        setFilterOperator(operatorValue);
        setFilterValue(value);
        setPage(0);
    };

    if (error) {
        console.error(error);
        return (
            <AdminOnlyAlert>
                {translate('annotation_query_error')}
            </AdminOnlyAlert>
        );
    }

    return (
        <DataGrid
            loading={isPending || isFetching}
            columns={[
                {
                    field: 'comment',
                    headerName: translate('annotation.comment'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    flex: 1,
                },
                {
                    field: 'resource',
                    headerName: translate('annotation.resource'),
                    flex: 1,
                    sortable: false,
                    filterable: false,
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
                    filterable: false,
                },
            ]}
            rows={data?.data || []}
            getRowId={({ _id }) => _id}
            rowCount={data?.fullTotal || 0}
            pageSize={perPage}
            paginationMode="server"
            sortingMode="server"
            filterMode="server"
            onPageChange={onPageChange}
            onPageSizeChange={setPerPage}
            onSortModelChange={handleSortModelChange}
            onFilterModelChange={handleFilterModelChange}
            rowsPerPageOptions={[10, 25, 50]}
        />
    );
};
