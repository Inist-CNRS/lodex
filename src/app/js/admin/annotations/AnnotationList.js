import { Tooltip, Typography } from '@mui/material';
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
import { useHistory } from 'react-router';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import { AnnotationStatus } from './AnnotationStatus';
import { ResourceTitleCell } from './ResourceTitleCell';
import { ResourceUriCell } from './ResourceUriCell';
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

export const AnnotationList = () => {
    const history = useHistory();
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
    const handleRowClick = (params) => {
        history.push(`/annotations/${params.row._id}`);
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
                    field: 'resourceUri',
                    headerName: translate('annotation_resource_uri'),
                    flex: 1,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell({ row }) {
                        return <ResourceUriCell row={row} />;
                    },
                },
                {
                    field: 'resource',
                    headerName: translate('annotation_resource'),
                    flex: 1,
                    sortable: false,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ row }) => {
                        return <ResourceTitleCell row={row} />;
                    },
                },
                {
                    field: 'field.label',
                    headerName: translate('annotation_field_label'),
                    valueGetter: ({ row }) => row?.field?.label,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        return (
                            <Typography>
                                {value ??
                                    translate('annotation_field_not_found')}
                            </Typography>
                        );
                    },
                    flex: 1,
                    sortable: false,
                },
                {
                    field: 'field.name',
                    headerName: translate('annotation_field_name'),
                    valueGetter: ({ row }) => row?.field?.name,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        if (!value) {
                            return null;
                        }
                        return <Typography>[{value}]</Typography>;
                    },
                    flex: 1,
                    sortable: false,
                },
                {
                    field: 'field.internalScopes',
                    headerName: translate('annotation_field_internal_scopes'),
                    valueGetter: ({ row }) =>
                        row?.field ? row.field?.internalScopes ?? [] : null,
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        if (!value) {
                            return null;
                        }

                        return (
                            <>
                                {value.map((scope) => (
                                    <FieldInternalIcon
                                        key={scope}
                                        scope={scope}
                                        p={{ t: translate }}
                                    />
                                ))}
                            </>
                        );
                    },
                    flex: 1,
                    sortable: false,
                },
                {
                    field: 'field.internalName',
                    valueGetter: ({ row }) => row?.field,
                    headerName: translate('annotation_field_internal_name'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        return <Typography>{value?.internalName}</Typography>;
                    },
                    flex: 1,
                    sortable: false,
                },
                {
                    field: 'initialValue',
                    headerName: translate('annotation_initial_value'),
                    flex: 1,
                    sortable: false,
                    renderCell: ({ value }) => {
                        return (
                            <Tooltip title={value}>
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Tooltip>
                        );
                    },
                },
                {
                    field: 'status',
                    headerName: translate('annotation_status'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        return <AnnotationStatus status={value} />;
                    },
                    flex: 1,
                    sortable: true,
                },
                {
                    field: 'internalComment',
                    headerName: translate('annotation_internal_comment'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    renderCell: ({ value }) => {
                        return (
                            <Tooltip title={value}>
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Tooltip>
                        );
                    },
                    flex: 1,
                    sortable: true,
                },
                {
                    field: 'administrator',
                    headerName: translate('annotation_administrator'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    flex: 1,
                    sortable: true,
                    renderCell({ value }) {
                        return <Typography>{value}</Typography>;
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
                    renderCell({ value }) {
                        return <Typography>{value}</Typography>;
                    },
                },
                {
                    field: 'comment',
                    headerName: translate('annotation_comment'),
                    filterOperators: getGridStringOperators().filter(
                        (operator) => operator.value === 'contains',
                    ),
                    flex: 1,
                    renderCell: ({ value }) => {
                        return (
                            <Tooltip title={value}>
                                <Typography
                                    sx={{
                                        textOverflow: 'ellipsis',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {value}
                                </Typography>
                            </Tooltip>
                        );
                    },
                },
                {
                    field: 'createdAt',
                    headerName: translate('annotation_created_at'),

                    flex: 1,
                    renderCell: ({ value }) => {
                        return (
                            <Typography>
                                {new Date(value).toLocaleDateString()}
                            </Typography>
                        );
                    },
                    filterOperators: getGridDateOperators().filter((operator) =>
                        ['is', 'after', 'before'].includes(operator.value),
                    ),
                    filterable: true,
                },
                {
                    field: 'updatedAt',
                    headerName: translate('annotation_updated_at'),

                    flex: 1,
                    renderCell: ({ value }) => {
                        return (
                            <Typography>
                                {new Date(value).toLocaleDateString()}
                            </Typography>
                        );
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
            onRowClick={handleRowClick}
        />
    );
};
