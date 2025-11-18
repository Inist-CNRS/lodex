import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    DataGrid,
    getGridBooleanOperators,
    getGridNumericOperators,
    getGridStringOperators,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
    type GridCellParams,
    type GridEventListener,
    type GridFilterModel,
    type GridRenderCellParams,
    type GridRowId,
    type GridSortModel,
} from '@mui/x-data-grid';
import {
    useCallback,
    useEffect,
    useMemo,
    useState,
    type ChangeEvent,
} from 'react';
import { connect } from 'react-redux';
import { TaskStatus, type TaskStatusType } from '@lodex/common';

import { AddBox as AddBoxIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Drawer,
    IconButton,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    TableRow,
    Tooltip,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import Loading from '@lodex/frontend-common/components/Loading';
import datasetApi from '../api/dataset';
import { fromEnrichments, fromParsing } from '../selectors';
import { DeleteFilteredButton } from './DeleteFilteredButton';
import { DeleteManyButton } from './DeleteManyButton';
import ParsingEditCell from './ParsingEditCell';
import type { State } from '../reducers';
import { CellWithTooltip } from '../annotations/CellWithTooltip';

const COLUMN_TYPE = {
    MAIN: 'main',
    ENRICHMENT: 'enrichment',
};
const styles = {
    container: {
        position: 'relative',
        flex: '1 1 auto',
        display: 'flex',
        height: 'calc(100vh - 170px)',
    },
    enrichedColumn: {
        backgroundColor: 'primary.light',
    },
    footer: {
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2,
        height: '30px',
    },
    columnToggle: {
        display: 'flex',
    },
    footerItem: {
        paddingLeft: '1rem',
        paddingRight: '1rem',
        backgroundColor: 'neutralDark.veryLight',
        lineHeight: '30px',
        height: '100%',
        alignItems: 'center',
        display: 'flex',
    },
    footerItemText: {
        paddingRight: '1rem',
    },
    toggle: {
        cursor: 'pointer',
    },
    drawer: {
        width: '45%',
    },
    errorChip: {
        backgroundColor: 'danger.main',
        color: 'contrast.main',
    },
    errorHeader: {
        color: 'warning.main',
    },
};

const getFiltersOperatorsForType = (type: string) => {
    switch (type) {
        case 'number':
            return getGridNumericOperators().filter(
                (operator: { value: string }) =>
                    operator.value === '=' ||
                    operator.value === '<' ||
                    operator.value === '>',
            );
        case 'boolean':
            return getGridBooleanOperators();
        default:
            return getGridStringOperators().filter(
                (operator) => operator.value === 'contains',
            );
    }
};

interface ParsingResultComponentProps {
    precomputedId?: string;
    loadingParsingResult: boolean;
    enrichments: {
        name: string;
        errorCount?: number;
        status: TaskStatusType;
    }[];
}

const CustomToolbar = ({
    selectedRowIds,
    fetchDataset,
    filterModel,
    handleFilteredRowsDeleted,
}: {
    selectedRowIds: GridRowId[];
    fetchDataset: () => void;
    filterModel: GridFilterModel;
    handleFilteredRowsDeleted: () => void;
}) => {
    const { translate } = useTranslate();
    return (
        <GridToolbarContainer sx={{ gap: 1 }}>
            <Tooltip title={translate(`column_tooltip`)}>
                <GridToolbarColumnsButton />
            </Tooltip>
            <GridToolbarFilterButton />
            <Tooltip title={translate(`density_tooltip`)}>
                <GridToolbarDensitySelector />
            </Tooltip>
            <Tooltip title={translate(`add_more_data`)}>
                <Button
                    component={Link}
                    to="/data/add"
                    startIcon={<AddBoxIcon />}
                    size="small"
                    sx={{
                        '&.MuiButtonBase-root:hover': {
                            color: 'primary.main',
                        },
                    }}
                >
                    {translate('add_more')}
                </Button>
            </Tooltip>
            <Box sx={{ flexGrow: 1 }} />
            <DeleteManyButton
                selectedRowIds={selectedRowIds as string[]}
                reloadDataset={fetchDataset}
            />
            {filterModel.items.length > 0 && (
                <DeleteFilteredButton
                    filter={filterModel.items[0]}
                    reloadDataset={handleFilteredRowsDeleted}
                />
            )}
        </GridToolbarContainer>
    );
};

const CustomFooter = ({
    showEnrichmentColumns,
    setShowEnrichmentColumns,
    showMainColumns,
    setShowMainColumns,
    fetchDataset,
    rowCount,
    skip,
    limit,
    onPageChange,
    columns,
    enrichments,
}: {
    showEnrichmentColumns: boolean;
    setShowEnrichmentColumns: (show: boolean) => void;
    showMainColumns: boolean;
    setShowMainColumns: (show: boolean) => void;
    fetchDataset: () => void;
    rowCount: number;
    skip: number;
    limit: number;
    onPageChange: (params: { page: number; pageSize: number }) => void;
    columns: {
        key: string;
    }[];
    enrichments?: {
        name: string;
    }[];
}) => {
    const { translate } = useTranslate();

    const handleChangeRowsPerPage = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            onPageChange({ page: 0, pageSize: parseInt(e.target.value, 10) });
        },
        [onPageChange],
    );

    const numberOfColumns = useCallback(
        (columnType: string) => {
            if (!columns || columns.length === 0 || !enrichments) return 0;
            return columns.filter(({ key }) => {
                const isEnrichmentColumn = enrichments.some(
                    (enrichment) => enrichment.name === key,
                );
                switch (columnType) {
                    case COLUMN_TYPE.MAIN:
                        return key !== '_id' && !isEnrichmentColumn;
                    case COLUMN_TYPE.ENRICHMENT:
                        return isEnrichmentColumn;
                    default:
                        return false;
                }
            }).length;
        },
        [columns, enrichments],
    );

    return (
        <Box sx={styles.footer}>
            <Box sx={styles.columnToggle}>
                <Box
                    sx={{
                        ...styles.footerItem,
                        ...styles.toggle,
                    }}
                    onClick={() => {
                        setShowMainColumns(!showMainColumns);
                    }}
                >
                    <Box sx={styles.footerItemText}>
                        {translate('parsing_summary_columns', {
                            smart_count: numberOfColumns(COLUMN_TYPE.MAIN),
                        })}
                    </Box>
                    <Tooltip title={translate(`toggle_loaded`)}>
                        {showMainColumns ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </Tooltip>
                </Box>

                <Box
                    sx={{
                        ...styles.enrichedColumn,
                        ...styles.footerItem,
                        ...styles.toggle,
                    }}
                    onClick={() => {
                        setShowEnrichmentColumns(!showEnrichmentColumns);
                    }}
                >
                    <Box sx={styles.footerItemText}>
                        {translate('parsing_enriched_columns', {
                            smart_count: numberOfColumns(
                                COLUMN_TYPE.ENRICHMENT,
                            ),
                        })}
                    </Box>
                    <Tooltip title={translate(`toggle_enriched`)}>
                        {showEnrichmentColumns ? (
                            <VisibilityIcon />
                        ) : (
                            <VisibilityOffIcon />
                        )}
                    </Tooltip>
                </Box>
            </Box>
            <Box display="flex">
                <Tooltip title={translate(`refresh_button`)}>
                    <IconButton onClick={() => fetchDataset()}>
                        <RefreshIcon />
                    </IconButton>
                </Tooltip>
                <TableContainer>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <TablePagination
                                    count={rowCount}
                                    page={skip / limit}
                                    rowsPerPage={limit}
                                    onPageChange={(_e, page) =>
                                        onPageChange({ page, pageSize: limit })
                                    }
                                    rowsPerPageOptions={[25, 50, 100]}
                                    labelRowsPerPage={translate(
                                        'rows_per_page',
                                    )}
                                    onRowsPerPageChange={
                                        handleChangeRowsPerPage
                                    }
                                />
                            </TableRow>
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </Box>
    );
};

export const ParsingResultComponent = ({
    precomputedId,
    enrichments,
    loadingParsingResult,
}: ParsingResultComponentProps) => {
    const { translate } = useTranslate();

    const { search } = useLocation();
    const initialFilterModel: GridFilterModel = useMemo((): GridFilterModel => {
        const searchParams = new URLSearchParams(search);
        const searchParamsFilteredUri = searchParams.get('uri');
        if (searchParamsFilteredUri) {
            return {
                items: [
                    {
                        field: 'uri',
                        operator: 'contains',
                        value: searchParamsFilteredUri,
                    },
                ],
            };
        }

        return { items: [] };
    }, [search]);

    const [showEnrichmentColumns, setShowEnrichmentColumns] = useState(true);
    const [showMainColumns, setShowMainColumns] = useState(true);
    const [selectedRowIds, setSelectedRowIds] = useState<GridRowId[]>([]);

    const [datas, setDatas] = useState<
        {
            _id: string;
            [key: string]: unknown;
        }[]
    >([]);
    const [columns, setColumns] = useState([]);
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [selectedCell, setSelectedCell] = useState<GridCellParams | null>(
        null,
    );

    const columnsToShow = useMemo(() => {
        const enrichmentsNames = enrichments.map(
            (enrichment) => enrichment.name,
        );

        const res = columns
            .filter(({ key }) => {
                const isEnrichment = enrichmentsNames.includes(key);
                return (
                    key !== '_id' &&
                    (key === 'uri' ||
                        (showEnrichmentColumns && isEnrichment) ||
                        (showMainColumns && !enrichmentsNames.includes(key)))
                );
            })
            .map(({ key, type }) => {
                const isEnrichment = enrichmentsNames.includes(key);
                const isEnrichmentLoading =
                    isEnrichment &&
                    enrichments.some(
                        (enrichment) =>
                            enrichment.name === key &&
                            enrichment.status === TaskStatus.IN_PROGRESS,
                    );
                const errorCount = isEnrichment
                    ? enrichments.find((enrichment) => enrichment.name === key)
                          ?.errorCount
                    : null;
                return {
                    field: key,
                    headerName: errorCount
                        ? translate('header_name_with_errors', {
                              name: key,
                              errorCount,
                          })
                        : key,
                    headerClassName: errorCount ? 'error-header' : undefined,
                    cellClassName: isEnrichment ? 'enriched-column' : undefined,
                    flex: 1,
                    minWidth: 150,
                    filterable: type !== 'object',
                    sortable: type !== 'object',
                    filterOperators: getFiltersOperatorsForType(type),
                    type,
                    getActions: () => [],
                    renderCell: (params: GridRenderCellParams) => {
                        if (isEnrichmentLoading && params.value === undefined)
                            return (
                                <CircularProgress
                                    variant="indeterminate"
                                    size={20}
                                />
                            );
                        if (params.value === undefined) {
                            return <Chip label="undefined" />;
                        }
                        if (params.value === null) {
                            return <Chip label="null" />;
                        }
                        if (
                            typeof params.value === 'string' &&
                            (params.value.startsWith('[Error]') ||
                                params.value.startsWith('ERROR'))
                        ) {
                            return <Chip sx={styles.errorChip} label="Error" />;
                        }
                        return (
                            <CellWithTooltip
                                value={JSON.stringify(params.value)}
                            />
                        );
                    },
                };
            });

        return res;
    }, [
        columns,
        showEnrichmentColumns,
        showMainColumns,
        enrichments,
        translate,
    ]);

    const rows = useMemo(() => {
        if (!datas || !Array.isArray(datas)) return [];
        return datas.map((data) => ({ id: data._id, ...data }));
    }, [datas]);

    const [rowCount, setRowCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(25);
    const [sort, setSort] = useState({});
    const [filterModel, setFilterModel] =
        useState<GridFilterModel>(initialFilterModel);

    const fetchDataset = useCallback(async () => {
        const { count: datasCount, datas } = await datasetApi.getData({
            precomputedId,
            skip,
            limit,
            filter: filterModel.items.at(0) as
                | {
                      field: string;
                      operator: string;
                      value: string;
                  }
                | undefined,
            sort,
        });
        setRowCount(datasCount ?? 0);
        setDatas(datas);
    }, [skip, limit, filterModel, sort, precomputedId]);

    const onPageChange = useCallback(
        ({ page, pageSize }: { page: number; pageSize: number }) => {
            setSkip(page * limit);
            setLimit(pageSize);
        },
        [limit],
    );

    const handleFilterModelChange = useCallback(
        (filterModel: GridFilterModel) => {
            setFilterModel(filterModel);
            setSkip(0);
        },
        [],
    );

    const handleFilteredRowsDeleted = useCallback(() => {
        handleFilterModelChange({ items: [] });
    }, [handleFilterModelChange]);

    useEffect(() => {
        const fetchDataColumns = async () => {
            const { columns } = await datasetApi.getDataColumns(precomputedId);
            setColumns(columns);
            // We need to initialize the filter model with the columns otherwise it gets erased by MUI datagrid somehow.
            handleFilterModelChange(initialFilterModel);
        };
        fetchDataColumns();
    }, [handleFilterModelChange, initialFilterModel, precomputedId]);

    useEffect(() => {
        fetchDataset();
    }, [skip, limit, filterModel, sort, fetchDataset]);

    const handleSortModelChange = useCallback(
        (sortModel: GridSortModel) => {
            setSort({
                sortBy: sortModel[0]?.field,
                sortDir: sortModel[0]?.sort,
            });
        },
        [setSort],
    );

    const handleCellClick: GridEventListener<'cellClick'> = useCallback(
        (params) => {
            if (params.field === '__check__') {
                return;
            }
            setSelectedCell(params);
            setToggleDrawer(true);
        },
        [setSelectedCell, setToggleDrawer],
    );

    const getRowId = useCallback((row: { _id: string }) => row._id, []);

    if (loadingParsingResult) {
        return (
            <Loading className="admin">
                {translate('loading_parsing_results')}
            </Loading>
        );
    }

    return (
        <Box sx={styles.container}>
            <DataGrid
                columns={columnsToShow}
                rows={rows}
                getRowId={getRowId}
                checkboxSelection
                onSortModelChange={handleSortModelChange}
                paginationMode="server"
                sortingMode="server"
                filterMode="server"
                rowBuffer={limit}
                filterModel={filterModel}
                onFilterModelChange={handleFilterModelChange}
                onCellClick={handleCellClick}
                pagination
                onRowSelectionModelChange={setSelectedRowIds}
                slots={{
                    footer: () => (
                        <CustomFooter
                            fetchDataset={fetchDataset}
                            limit={limit}
                            onPageChange={onPageChange}
                            rowCount={rowCount}
                            setShowEnrichmentColumns={setShowEnrichmentColumns}
                            setShowMainColumns={setShowMainColumns}
                            showEnrichmentColumns={showEnrichmentColumns}
                            showMainColumns={showMainColumns}
                            skip={skip}
                            columns={columns}
                            enrichments={enrichments}
                        />
                    ),
                    toolbar: () => (
                        <CustomToolbar
                            fetchDataset={fetchDataset}
                            filterModel={filterModel}
                            handleFilteredRowsDeleted={
                                handleFilteredRowsDeleted
                            }
                            selectedRowIds={selectedRowIds}
                        />
                    ),
                }}
                sx={{
                    ['& .error-header']: styles.errorHeader,
                    ['& .enriched-column']: styles.enrichedColumn,
                }}
            />
            <Drawer
                anchor="right"
                open={toggleDrawer}
                onClose={() => setToggleDrawer(false)}
                sx={{
                    ...styles.drawer,
                    '& .MuiDrawer-paper': styles.drawer,
                }}
            >
                {selectedCell ? (
                    <ParsingEditCell
                        cell={selectedCell}
                        precomputedId={precomputedId}
                        setToggleDrawer={setToggleDrawer}
                    />
                ) : null}
            </Drawer>
        </Box>
    );
};

const mapStateToProps = (state: State) => ({
    loadingParsingResult: fromParsing.isParsingLoading(state),
    enrichments: fromEnrichments.enrichments(state),
});

// @ts-expect-error TS2345
export default connect(mapStateToProps)(ParsingResultComponent);
