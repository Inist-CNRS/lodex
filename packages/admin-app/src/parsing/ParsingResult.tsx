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
} from '@mui/x-data-grid';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import { TaskStatus } from '@lodex/common';

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
import datasetApi from '../api/dataset';
import { fromEnrichments, fromParsing } from '../selectors';
import { DeleteFilteredButton } from './DeleteFilteredButton';
import { DeleteManyButton } from './DeleteManyButton';
import ParsingEditCell from './ParsingEditCell';

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
        overflow: 'hidden',
        height: 30,
        alignItems: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'space-between',
        zIndex: 2,
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

// @ts-expect-error TS7006
const getFiltersOperatorsForType = (type) => {
    switch (type) {
        case 'number':
            return getGridNumericOperators().filter(
                (operator) =>
                    operator.value === '=' ||
                    operator.value === '<' ||
                    operator.value === '>',
            );
        case 'boolean':
            return getGridBooleanOperators();
        default:
            return getGridStringOperators().filter(
                (operator) =>
                    operator.value === 'contains' ||
                    operator.value === 'equals',
            );
    }
};

interface ParsingResultComponentProps {
    precomputedId?: string;
    loadingParsingResult: boolean;
    totalLoadedLines?: number;
    enrichments?: object[];
    loadingEnrichments?: boolean;
}

export const ParsingResultComponent = ({
    precomputedId,
    enrichments,
    loadingEnrichments,
    loadingParsingResult,
    totalLoadedLines,
}: ParsingResultComponentProps) => {
    const { translate } = useTranslate();

    const { search } = useLocation();
    const initialFilterModel = useMemo(() => {
        const searchParams = new URLSearchParams(search);
        const searchParamsFilteredUri = searchParams.get('uri');
        if (searchParamsFilteredUri) {
            return {
                items: [
                    {
                        columnField: 'uri',
                        operatorValue: 'contains',
                        value: searchParamsFilteredUri,
                    },
                ],
            };
        }

        return { items: [] };
    }, [search]);

    const [showEnrichmentColumns, setShowEnrichmentColumns] = useState(true);
    const [showMainColumns, setShowMainColumns] = useState(true);
    const [selectedRowIds, setSelectedRowIds] = useState([]);

    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(25);
    const [sort, setSort] = useState({});
    const [filterModel, setFilterModel] = useState(initialFilterModel);

    // Follow the main dataset while it is being imported. Columns come from
    // the first documents, so they are reloaded too: lines saved after the
    // first reload may bring new keys.
    const loadedLines = precomputedId ? undefined : totalLoadedLines;
    const source = [precomputedId ?? null, loadedLines ?? null];

    // Rows and columns are cached by react-query: coming back to a tab, a
    // page or a precomputation shows what was last fetched at once, then
    // refreshes it in the background. Overlapping reloads (page change,
    // import, enrichment) are deduplicated: only the last one updates the grid.
    const filter = filterModel.items.at(0);
    const datasetQuery = useQuery({
        queryKey: ['dataset-rows', ...source, { skip, limit, filter, sort }],
        queryFn: () =>
            datasetApi.getData({ precomputedId, skip, limit, filter, sort }),
        keepPreviousData: true,
    });
    const rowCount: number = datasetQuery.data?.count ?? 0;
    const rows = useMemo(() => {
        const datas = datasetQuery.data?.datas;
        if (!Array.isArray(datas)) return [];
        return datas.map((data) => ({ id: data._id, ...data }));
    }, [datasetQuery.data]);
    const fetchDataset = datasetQuery.refetch;
    // Rows already on screen stay readable while they are refreshed: the
    // refresh icon spins instead of the overlay covering the grid.
    const isRefreshing = loadingParsingResult || datasetQuery.isFetching;

    const columnsQuery = useQuery({
        queryKey: ['dataset-columns', ...source],
        queryFn: async () => {
            const { columns, error } =
                await datasetApi.getDataColumns(precomputedId);
            // a failed request keeps the current columns instead of emptying the grid
            if (error) throw error;
            return columns as { key: string; type: string }[];
        },
        keepPreviousData: true,
        retry: false,
    });
    const columns = useMemo(() => columnsQuery.data ?? [], [columnsQuery.data]);
    const fetchColumns = columnsQuery.refetch;

    const columnsToShow = useMemo(() => {
        const getColumnsToShow = () => {
            // @ts-expect-error TS18048
            const enrichmentsNames = enrichments.map(
                // @ts-expect-error TS7006
                (enrichment) => enrichment.name,
            );

            const res = columns
                .filter(({ key }) => {
                    const isEnrichment = enrichmentsNames.includes(key);
                    return (
                        String(key).startsWith('_lodex') !== true &&
                        key !== '_id' &&
                        (key === 'uri' ||
                            (showEnrichmentColumns && isEnrichment) ||
                            (showMainColumns &&
                                !enrichmentsNames.includes(key)))
                    );
                })
                .map(({ key, type }) => {
                    const isEnrichment = enrichmentsNames.includes(key);
                    const isEnrichmentLoading =
                        isEnrichment &&
                        // @ts-expect-error TS18048
                        enrichments.some(
                            (enrichment) =>
                                // @ts-expect-error TS2339
                                enrichment.name === key &&
                                // @ts-expect-error TS2339
                                enrichment.status === TaskStatus.IN_PROGRESS,
                        );
                    const errorCount = isEnrichment
                        ? // @ts-expect-error TS18048
                          enrichments.find(
                              // @ts-expect-error TS7006
                              (enrichment) => enrichment.name === key,
                              // @ts-expect-error TS2339
                          )?.errorCount
                        : null;
                    return {
                        field: key,
                        headerName: errorCount
                            ? translate('header_name_with_errors', {
                                  name: key,
                                  errorCount,
                              })
                            : key,
                        headerClassName: errorCount && 'error-header',
                        cellClassName: isEnrichment && 'enriched-column',
                        flex: 1,
                        minWidth: 150,
                        filterable: type !== 'object',
                        sortable: type !== 'object',
                        filterOperators: getFiltersOperatorsForType(type),
                        type: type === 'object' ? undefined : type, // "object" is not a DataGrid column type
                        // @ts-expect-error TS7006
                        renderCell: (params) => {
                            if (
                                isEnrichmentLoading &&
                                params.value === undefined
                            )
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
                                    params.value.startsWith('ERROR') ||
                                    params.value.startsWith('TypeError'))
                            ) {
                                return (
                                    <Chip sx={styles.errorChip} label="Error" />
                                );
                            }
                            const value = JSON.stringify(params.value);
                            return <div title={value}>{value}</div>;
                        },
                    };
                });

            return res;
        };

        return getColumnsToShow(
            // @ts-expect-error TS2554
            columns,
            showEnrichmentColumns,
            showMainColumns,
            enrichments,
        );
    }, [
        columns,
        showEnrichmentColumns,
        showMainColumns,
        enrichments,
        translate,
    ]);

    const numberOfColumns = useCallback(
        // @ts-expect-error TS7006
        (columnType) => {
            if (!columns || columns.length === 0 || !enrichments) return 0;
            return columns.filter(({ key }) => {
                const isEnrichmentColumn = enrichments.some(
                    // @ts-expect-error TS7006
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

    // @ts-expect-error TS7006
    const onPageChange = (page) => {
        setSkip(page * limit);
    };

    // @ts-expect-error TS7006
    const handleChangeRowsPerPage = (e) => {
        setLimit(e.target.value);
        setSkip(0);
    };

    // @ts-expect-error TS7006
    const handleFilterModelChange = useCallback((filterModel) => {
        setFilterModel(filterModel);
        setSkip(0);
    }, []);

    const handleFilteredRowsDeleted = useCallback(() => {
        handleFilterModelChange({ items: [] });
    }, [handleFilterModelChange]);

    // We need to initialize the filter model with the columns otherwise it gets erased by MUI datagrid somehow.
    const hasColumns = columnsQuery.data !== undefined;
    useEffect(() => {
        if (hasColumns) handleFilterModelChange(initialFilterModel);
    }, [hasColumns, handleFilterModelChange, initialFilterModel]);

    // An enrichment adds keys without adding lines: when one changes status,
    // reload the columns and rows, keeping the filter and page of the admin.
    // Not while the enrichments load, and not on their first load: the grid
    // fetched both when it mounted.
    const enrichmentsState =
        precomputedId || loadingEnrichments
            ? undefined
            : enrichments
                  // @ts-expect-error TS2339
                  ?.map(({ name, status }) => `${name}:${status}`)
                  .join();
    const lastEnrichmentsState = useRef<string>();
    useEffect(() => {
        if (enrichmentsState === undefined) {
            return;
        }
        const previous = lastEnrichmentsState.current;
        lastEnrichmentsState.current = enrichmentsState;
        if (previous === undefined || previous === enrichmentsState) {
            return;
        }
        fetchColumns();
        fetchDataset();
        // only a status change reloads, not a new page or filter
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enrichmentsState]);

    // @ts-expect-error TS7006
    const handleSortModelChange = (sortModel) => {
        setSort({
            sortBy: sortModel[0]?.field,
            sortDir: sortModel[0]?.sort,
        });
    };

    // @ts-expect-error TS7006
    const handleCellClick = (params) => {
        if (params.field === '__check__') {
            return;
        }
        setSelectedCell(params);
        setToggleDrawer(true);
    };

    const CustomFooter = () => {
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
                            <RefreshIcon
                                sx={
                                    isRefreshing
                                        ? {
                                              animation:
                                                  'refresh-spin 1s linear infinite',
                                              '@keyframes refresh-spin': {
                                                  to: {
                                                      transform:
                                                          'rotate(360deg)',
                                                  },
                                              },
                                          }
                                        : undefined
                                }
                            />
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
                                            onPageChange(page)
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

    const CustomToolbar = () => {
        return (
            // @ts-expect-error TS2322
            <GridToolbarContainer sx={{ gap: 1 }}>
                <Tooltip title={translate(`column_tooltip`)}>
                    {/*
                     // @ts-expect-error TS2741 */}
                    <GridToolbarColumnsButton />
                </Tooltip>
                {/*
                 // @ts-expect-error TS2739 */}
                <GridToolbarFilterButton />
                <Tooltip title={translate(`density_tooltip`)}>
                    {/*
                     // @ts-expect-error TS2741 */}
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
                    selectedRowIds={selectedRowIds}
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

    return (
        <Box sx={styles.container}>
            <DataGrid
                // @ts-expect-error TS2322
                columns={columnsToShow}
                rows={rows}
                getRowId={(row) => row._id}
                rowCount={rowCount}
                loading={isRefreshing && datasetQuery.data === undefined}
                pageSize={limit}
                checkboxSelection
                paginationMode="server"
                onPageChange={onPageChange}
                onPageSizeChange={setLimit}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                filterMode="server"
                filterModel={filterModel}
                rowBuffer={limit ?? 100}
                columnBuffer={columnsToShow.length}
                onFilterModelChange={handleFilterModelChange}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick={true}
                onCellClick={handleCellClick}
                selectionModel={selectedRowIds}
                // @ts-expect-error TS2322
                onSelectionModelChange={setSelectedRowIds}
                components={{
                    Footer: CustomFooter,
                    Toolbar: CustomToolbar,
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    loadingParsingResult: fromParsing.isParsingLoading(state),
    totalLoadedLines: fromParsing.getTotalLoadedLines(state),
    enrichments: fromEnrichments.enrichments(state),
    loadingEnrichments: fromEnrichments.isLoadEnrichmentsPending(state),
});

export default connect(mapStateToProps)(ParsingResultComponent);
