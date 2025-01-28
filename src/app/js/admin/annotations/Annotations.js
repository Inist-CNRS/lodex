import { Tooltip } from '@mui/material';
import {
    DataGrid,
    getGridDateOperators,
    getGridStringOperators,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import React, { useState } from 'react';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import { ResourceCell } from './ResourceCell';
import { useGetAnnotations } from './useGetAnnotations';

const AnnotationListToolBar = () => {
    const { translate } = useTranslate();

    return (
        <GridToolbarContainer>
            <Tooltip title={translate(`column_tooltip`)}>
                <GridToolbarColumnsButton />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={translate(`density_tooltip`)}>
                <GridToolbarDensitySelector />
            </Tooltip>
        </GridToolbarContainer>
    );
};

export const Annotations = () => {
    const { translate } = useTranslate();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(25);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [filter, setFilter] = useState({});
    const { isPending, error, data, isFetching } = useGetAnnotations({
        page,
        perPage,
        sortDir,
        sortBy,
        filter,
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
            setFilter({});
            return;
        }
        const { columnField, operatorValue, value } = filterModel.items[0];
        setFilter({
            filterBy:
                columnField === 'resource' ? 'resource.title' : columnField,
            filterOperator: operatorValue,
            filterValue: value,
        });
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
                    headerName: translate('annotation_comment'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    flex: 1,
                },
                {
                    field: 'resource',
                    headerName: translate('annotation_resource'),
                    flex: 1,
                    sortable: false,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        return <ResourceCell resource={value} />;
                    },
                },
                {
                    field: 'authorName',
                    headerName: translate('annotation_authorName'),
                    flex: 1,
                    sortable: false,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                },
                {
                    field: 'createdAt',
                    headerName: translate('annotation_created_at'),

                    flex: 1,
                    renderCell: ({ value }) => {
                        return new Date(value).toLocaleDateString();
                    },
                    filterOperators: getGridDateOperators().filter((operator) =>
                        ['is', 'after', 'before'].includes(operator.value),
                    ),
                    filterable: true,
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
            components={{
                Toolbar: AnnotationListToolBar,
            }}
        />
    );
};
