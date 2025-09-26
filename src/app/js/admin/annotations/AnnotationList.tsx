import { Box, Tooltip } from '@mui/material';
import {
    DataGrid,
    getGridDateOperators,
    getGridStringOperators,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import FieldInternalIcon from '../../fields/FieldInternalIcon';
import { useTranslate } from '../../i18n/I18NContext';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import withInitialData from '../withInitialData';
import { AnnotationProposedValue } from './AnnotationProposedValue';
import { AnnotationStatus } from './AnnotationStatus';
import { CellWithTooltip } from './CellWithTooltip';
import { DeleteFilteredButton } from './DeleteFilteredButton';
import { DeleteManyButton } from './DeleteManyButton';
import { FieldScopeFilter } from './filters/FieldScopeFilter';
import { KindFilter } from './filters/KindFilter';
import { StatusFilter } from './filters/StatusFilter';
import { useGetAnnotations } from './hooks/useGetAnnotations';
import { ResourceTitleCell } from './ResourceTitleCell';
import { ResourceUriCell } from './ResourceUriCell';

// @ts-expect-error TS7031
const AnnotationListToolBar = ({ deleteButton }) => {
    const { translate } = useTranslate();

    return (
        // @ts-expect-error TS2322
        <GridToolbarContainer sx={{ gap: 1 }}>
            <Tooltip title={translate(`column_tooltip`)}>
                {/*
                 // @ts-expect-error TS2741 */}
                <GridToolbarColumnsButton />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={translate(`density_tooltip`)}>
                {/*
                 // @ts-expect-error TS2741 */}
                <GridToolbarDensitySelector />
            </Tooltip>

            <Box sx={{ flexGrow: 1 }} />

            <DeleteFilteredButton />
            {deleteButton}
        </GridToolbarContainer>
    );
};

AnnotationListToolBar.propTypes = {
    deleteButton: PropTypes.node.isRequired,
};

export const AnnotationList = () => {
    const history = useHistory();
    const { translate } = useTranslate();
    const [page, setPage] = useState(0);
    const [perPage, setPerPage] = useState(25);
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortDir, setSortDir] = useState('desc');
    const [filter, setFilter] = useState({});

    // @ts-expect-error TS2339
    const { isPending, error, data, isFetching } = useGetAnnotations({
        page,
        perPage,
        sortDir,
        sortBy,
        filter,
    });
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    // @ts-expect-error TS7006
    const onPageChange = (page) => {
        setPage(page);
    };
    // @ts-expect-error TS7006
    const handleSortModelChange = (sortModel) => {
        setSortBy(sortModel[0]?.field);
        setSortDir(sortModel[0]?.sort);
    };

    // @ts-expect-error TS7006
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

    // @ts-expect-error TS7006
    const handleRowClick = (params) => {
        history.push(`/annotations/${params.row._id}`);
    };

    const columns = useMemo(() => {
        return [
            {
                field: 'resourceUri',
                headerName: translate('annotation_resource_uri'),
                flex: 1,
                filterOperators: getGridStringOperators().filter(
                    (operator) =>
                        operator.value === 'contains' ||
                        operator.value === 'equals',
                ),
                // @ts-expect-error TS7031
                renderCell({ row }) {
                    return <ResourceUriCell row={row} />;
                },
            },
            {
                field: 'resource',
                headerName: translate('annotation_resource_header'),
                flex: 1,
                sortable: false,
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                // @ts-expect-error TS7031
                renderCell: ({ row }) => {
                    return <ResourceTitleCell row={row} />;
                },
            },
            {
                field: 'kind',
                headerName: translate('annotation_kind'),
                flex: 1,
                sortable: true,
                filterOperators: getGridStringOperators()
                    .filter((operator) => operator.value === 'equals')
                    .map((operator) => ({
                        ...operator,
                        InputComponent: KindFilter,
                    })),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <CellWithTooltip value={translate(value)} />;
                },
            },
            {
                field: 'field.label',
                headerName: translate('annotation_field_label'),
                // @ts-expect-error TS7031
                valueGetter: ({ row }) => row?.field?.label,
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return (
                        <CellWithTooltip
                            value={
                                value ?? translate('annotation_field_not_found')
                            }
                        />
                    );
                },
                flex: 1,
                sortable: false,
            },
            {
                field: 'field.name',
                headerName: translate('annotation_field_name'),
                // @ts-expect-error TS7031
                valueGetter: ({ row }) => row?.field?.name,
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    if (!value) {
                        return null;
                    }
                    return <CellWithTooltip value={`[${value}]`} />;
                },
                flex: 1,
                sortable: false,
            },
            {
                field: 'field.internalScopes',
                headerName: translate('annotation_field_internal_scopes'),
                // @ts-expect-error TS7031
                valueGetter: ({ row }) =>
                    row?.field ? row.field?.internalScopes ?? [] : null,
                filterOperators: getGridStringOperators()
                    .filter((operator) => operator.value === 'contains')
                    .map((operator) => ({
                        ...operator,
                        InputComponent: FieldScopeFilter,
                    })),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    if (!value) {
                        return null;
                    }

                    return (
                        <>
                            {/*
                             // @ts-expect-error TS7006 */}
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
                // @ts-expect-error TS7031
                valueGetter: ({ row }) => row?.field,
                headerName: translate('annotation_field_internal_name'),
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <CellWithTooltip value={value?.internalName} />;
                },
                flex: 1,
                sortable: false,
            },
            {
                field: 'initialValue',
                headerName: translate('annotation_initial_value'),
                flex: 1,
                sortable: false,
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <CellWithTooltip value={value} />;
                },
            },
            {
                field: 'proposedValue',
                // @ts-expect-error TS2554
                headerName: translate('annotation_proposed_value', {
                    smart_count: 2,
                }),
                flex: 1,
                sortable: false,
                // @ts-expect-error TS7031
                renderCell: ({ row, value }) => {
                    return (
                        <AnnotationProposedValue
                            proposedValue={value}
                            field={row.field}
                        />
                    );
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
                // @ts-expect-error TS7031
                renderCell({ value }) {
                    return <CellWithTooltip value={value} />;
                },
            },
            {
                field: 'comment',
                headerName: translate('annotation_comment'),
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                flex: 1,
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <CellWithTooltip value={value} />;
                },
            },
            {
                field: 'status',
                headerName: translate('annotation_status'),
                filterOperators: getGridStringOperators()
                    .filter((operator) => operator.value === 'equals')
                    .map((operator) => ({
                        ...operator,
                        InputComponent: StatusFilter,
                    })),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <AnnotationStatus status={value} />;
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
                // @ts-expect-error TS7031
                renderCell({ value }) {
                    return <CellWithTooltip value={value} />;
                },
            },
            {
                field: 'internalComment',
                headerName: translate('annotation_internal_comment'),
                filterOperators: getGridStringOperators().filter(
                    (operator) => operator.value === 'contains',
                ),
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return <CellWithTooltip value={value} />;
                },
                flex: 1,
                sortable: true,
            },
            {
                field: 'createdAt',
                headerName: translate('annotation_created_at'),

                flex: 1,
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return (
                        <CellWithTooltip
                            value={new Date(value).toLocaleDateString()}
                        />
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
                // @ts-expect-error TS7031
                renderCell: ({ value }) => {
                    return (
                        <CellWithTooltip
                            value={new Date(value).toLocaleDateString()}
                        />
                    );
                },
                filterOperators: getGridDateOperators().filter((operator) =>
                    ['is', 'after', 'before'].includes(operator.value),
                ),
                filterable: true,
            },
        ];
    }, [translate]);

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
            columns={columns}
            checkboxSelection
            // @ts-expect-error TS2322
            onSelectionModelChange={setSelectedRowIds}
            selectionModel={selectedRowIds}
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
                Toolbar: () => (
                    <AnnotationListToolBar
                        // @ts-expect-error TS2322
                        deleteButton={
                            <DeleteManyButton selectedRowIds={selectedRowIds} />
                        }
                    />
                ),
            }}
            onRowClick={handleRowClick}
            initialState={{
                columns: {
                    columnVisibilityModel: {
                        'field.name': false,
                        'field.internalName': false,
                        comment: false,
                        internalComment: false,
                        updatedAt: false,
                    },
                },
            }}
        />
    );
};

export default withInitialData(AnnotationList, true);
