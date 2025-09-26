import RefreshIcon from '@mui/icons-material/Refresh';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import {
    DataGrid,
    getGridBooleanOperators,
    getGridNumericColumnOperators,
    getGridStringOperators,
    GridToolbarColumnsButton,
    GridToolbarContainer,
    GridToolbarDensitySelector,
    GridToolbarFilterButton,
} from '@mui/x-data-grid';
import PropTypes from 'prop-types';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect } from 'react-redux';
import { IN_PROGRESS } from '../../../../common/taskStatus';

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
// @ts-expect-error TS7016
import { Link, useLocation } from 'react-router-dom';
import { useTranslate } from '../../i18n/I18NContext';
import Loading from '../../lib/components/Loading';
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
        height: 'calc(100vh - 90px)',
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
            return getGridNumericColumnOperators().filter(
                // @ts-expect-error TS7006
                (operator) =>
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

// @ts-expect-error TS7006
export const ParsingResultComponent = (props) => {
    const { enrichments, loadingParsingResult } = props;
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

    const [datas, setDatas] = useState([]);
    const [columns, setColumns] = useState([]);
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const columnsToShow = useMemo(() => {
        const getColumnsToShow = () => {
            const enrichmentsNames = enrichments.map(
                // @ts-expect-error TS7006
                (enrichment) => enrichment.name,
            );

            const res = columns
                .filter(({ key }) => {
                    const isEnrichment = enrichmentsNames.includes(key);
                    return (
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
                        enrichments.some(
                            // @ts-expect-error TS7006
                            (enrichment) =>
                                enrichment.name === key &&
                                enrichment.status === IN_PROGRESS,
                        );
                    const errorCount = isEnrichment
                        ? enrichments.find(
                              // @ts-expect-error TS7006
                              (enrichment) => enrichment.name === key,
                          )?.errorCount
                        : null;
                    return {
                        field: key,
                        headerName: errorCount
                            // @ts-expect-error TS2554
                            ? translate('header_name_with_errors', {
                                  name: key,
                                  errorCount,
                              })
                            : key,
                        headerClassName: errorCount && 'error-header',
                        cellClassName: isEnrichment && 'enriched-column',
                        width: 150,
                        filterable: type !== 'object',
                        sortable: type !== 'object',
                        filterOperators: getFiltersOperatorsForType(type),
                        type,
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
                                    params.value.startsWith('ERROR'))
                            ) {
                                return (
                                    <Chip sx={styles.errorChip} label="Error" />
                                );
                            }
                            return (
                                <div title={JSON.stringify(params.value)}>
                                    {JSON.stringify(params.value)}
                                </div>
                            );
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

    const rows = useMemo(() => {
        if (!datas || !Array.isArray(datas)) return [];
        // @ts-expect-error TS2339
        return datas.map((data) => ({ id: data._id, ...data }));
    }, [datas]);

    const [rowCount, setRowCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(25);
    const [sort, setSort] = useState({});
    const [filterModel, setFilterModel] = useState(initialFilterModel);

    const fetchDataset = useCallback(async () => {
        const { count: datasCount, datas } = await datasetApi.getDataset({
            skip,
            limit,
            filter: filterModel.items.at(0),
            sort,
        });
        setRowCount(datasCount);
        setDatas(datas);
    }, [skip, limit, filterModel, sort]);

    // @ts-expect-error TS7006
    const onPageChange = (page) => {
        setSkip(page * limit);
    };

    // @ts-expect-error TS7006
    const handleChangeRowsPerPage = (e) => {
        setLimit(e.target.value);
        setSkip(0);
    };

    const handleFilterModelChange = useCallback((filterModel) => {
        setFilterModel(filterModel);
        setSkip(0);
    }, []);

    const handleFilteredRowsDeleted = useCallback(() => {
        handleFilterModelChange({ items: [] });
    }, [handleFilterModelChange]);

    useEffect(() => {
        const fetchDataColumns = async () => {
            const { columns } = await datasetApi.getDatasetColumns();
            setColumns(columns);
            // We need to initialize the filter model with the columns otherwise it gets erased by MUI datagrid somehow.
            handleFilterModelChange(initialFilterModel);
        };
        fetchDataColumns();
    }, [handleFilterModelChange, initialFilterModel]);

    useEffect(() => {
        fetchDataset();
    }, [skip, limit, filterModel, sort, fetchDataset]);

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

    if (loadingParsingResult) {
        return (
            // @ts-expect-error TS2322
            <Loading className="admin">
                {translate('loading_parsing_results')}
            </Loading>
        );
    }

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
                            {/*
                             // @ts-expect-error TS2554 */}
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
                            {/*
                             // @ts-expect-error TS2554 */}
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
                                        onPageChange={(e, page) =>
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
                columns={columnsToShow}
                rows={rows}
                rowCount={rowCount}
                pageSize={limit}
                checkboxSelection
                paginationMode="server"
                onPageChange={onPageChange}
                onPageSizeChange={setLimit}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                filterMode="server"
                filterModel={filterModel}
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
                        setToggleDrawer={setToggleDrawer}
                    />
                ) : null}
            </Drawer>
        </Box>
    );
};

ParsingResultComponent.propTypes = {
    loadingParsingResult: PropTypes.bool.isRequired,
    enrichments: PropTypes.arrayOf(PropTypes.object),
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
    // @ts-expect-error TS2339
    loadingParsingResult: fromParsing.isParsingLoading(state),
    // @ts-expect-error TS2339
    enrichments: fromEnrichments.enrichments(state),
});

export default connect(mapStateToProps)(ParsingResultComponent);
