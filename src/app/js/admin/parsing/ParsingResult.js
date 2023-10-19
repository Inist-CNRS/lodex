import React, { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import {
    DataGrid,
    getGridNumericColumnOperators,
    getGridStringOperators,
    getGridBooleanOperators,
    gridClasses,
    GridToolbarContainer,
    GridToolbarColumnsButton,
    GridToolbarFilterButton,
    GridToolbarDensitySelector,
} from '@mui/x-data-grid';
import { IN_PROGRESS } from '../../../../common/taskStatus';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import RefreshIcon from '@mui/icons-material/Refresh';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromEnrichments, fromParsing, fromPublication } from '../selectors';
import datasetApi from '../api/dataset';
import Loading from '../../lib/components/Loading';
import {
    Box,
    Chip,
    CircularProgress,
    Drawer,
    IconButton,
    Tooltip,
    Button,
    Table,
    TableBody,
    TableContainer,
    TablePagination,
    TableRow,
} from '@mui/material';
import ParsingEditCell from './ParsingEditCell';
import { AddBox as AddBoxIcon, Delete } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ParsingDeleteRowDialogComponent from './ParsingDeleteRowDialog';

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

const getFiltersOperatorsForType = type => {
    switch (type) {
        case 'number':
            return getGridNumericColumnOperators().filter(
                operator =>
                    operator.value === '=' ||
                    operator.value === '<' ||
                    operator.value === '>',
            );
        case 'boolean':
            return getGridBooleanOperators();
        default:
            return getGridStringOperators().filter(
                operator => operator.value === 'contains',
            );
    }
};

export const ParsingResultComponent = props => {
    const {
        p: polyglot,
        enrichments,
        loadingParsingResult,
        isPublished,
    } = props;

    const [showEnrichmentColumns, setShowEnrichmentColumns] = useState(true);
    const [showMainColumns, setShowMainColumns] = useState(true);

    const [datas, setDatas] = useState([]);
    const [columns, setColumns] = useState([]);
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const [selectedRowForDelete, setSelectedRowForDelete] = useState(null);
    const [openDialogDeleteRow, setOpenDialogDeleteRow] = useState(false);

    const handleDeleteRow = (event, row) => {
        event.preventDefault();
        event.stopPropagation();
        setSelectedRowForDelete(row);
        setOpenDialogDeleteRow(true);
    };

    const getColumnsToShow = () => {
        const enrichmentsNames = enrichments.map(enrichment => enrichment.name);

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
                        enrichment =>
                            enrichment.name === key &&
                            enrichment.status === IN_PROGRESS,
                    );
                const errorCount = isEnrichment
                    ? enrichments.find(enrichment => enrichment.name === key)
                          ?.errorCount
                    : null;
                return {
                    field: key,
                    headerName: errorCount
                        ? polyglot.t('header_name_with_errors', {
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
                    renderCell: params => {
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
                            <div title={JSON.stringify(params.value)}>
                                {JSON.stringify(params.value)}
                            </div>
                        );
                    },
                };
            });
        res.unshift({
            field: 'delete-row',
            headerName: 'delete-row',
            width: 150,
            filterable: false,
            sortable: false,
            hideable: false,
            renderCell: params => {
                return (
                    <Tooltip title={polyglot.t('parsing_delete_row_tooltip')}>
                        <IconButton
                            aria-label="delete row"
                            onClick={e => handleDeleteRow(e, params.row)}
                        >
                            <Delete color="warning" />
                        </IconButton>
                    </Tooltip>
                );
            },
        });

        return res;
    };

    const columnsToShow = useMemo(
        () =>
            getColumnsToShow(
                columns,
                showEnrichmentColumns,
                showMainColumns,
                enrichments,
            ),
        [columns, showEnrichmentColumns, showMainColumns, enrichments],
    );

    const numberOfColumns = useCallback(
        columnType => {
            if (!columns || columns.length === 0 || !enrichments) return 0;
            return columns.filter(({ key }) => {
                const isEnrichmentColumn = enrichments.some(
                    enrichment => enrichment.name === key,
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
        return datas.map(data => ({ id: data._id, ...data }));
    }, [datas]);

    const [rowCount, setRowCount] = useState(0);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(25);
    const [sort, setSort] = useState({});
    const [filter, setFilter] = useState({});

    const fetchDataset = async () => {
        const { count: datasCount, datas } = await datasetApi.getDataset({
            skip,
            limit,
            filter,
            sort,
        });
        setRowCount(datasCount);
        setDatas(datas);
    };

    const onPageChange = page => {
        setSkip(page * limit);
    };

    useEffect(() => {
        const fetchDataColumns = async () => {
            const { columns } = await datasetApi.getDatasetColumns();
            setColumns(columns);
        };
        fetchDataColumns();
    }, []);
    useEffect(() => {
        fetchDataset();
    }, [skip, limit, filter, sort]);

    const handleSortModelChange = sortModel => {
        setSort({
            sortBy: sortModel[0]?.field,
            sortDir: sortModel[0]?.sort,
        });
    };

    const handleFilterModelChange = filterModel => {
        if (filterModel.items.length === 0) {
            return;
        }
        const { columnField, operatorValue, value } = filterModel.items[0];
        setFilter({ columnField, operatorValue, value });
    };

    const handleCellClick = params => {
        setSelectedCell(params);
        setToggleDrawer(true);
    };

    if (loadingParsingResult) {
        return (
            <Loading className="admin">
                {polyglot.t('loading_parsing_results')}
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
                            {polyglot.t('parsing_summary_columns', {
                                smart_count: numberOfColumns(COLUMN_TYPE.MAIN),
                            })}
                        </Box>
                        <Tooltip title={polyglot.t(`toggle_loaded`)}>
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
                            {polyglot.t('parsing_enriched_columns', {
                                smart_count: numberOfColumns(
                                    COLUMN_TYPE.ENRICHMENT,
                                ),
                            })}
                        </Box>
                        <Tooltip title={polyglot.t(`toggle_enriched`)}>
                            {showEnrichmentColumns ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Tooltip>
                    </Box>
                </Box>
                <Box display="flex">
                    <Tooltip title={polyglot.t(`refresh_button`)}>
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
                                        labelRowsPerPage={polyglot.t(
                                            'rows_per_page',
                                        )}
                                        onRowsPerPageChange={rpp => {
                                            setLimit(rpp.target.value);
                                        }}
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
            <GridToolbarContainer>
                <Tooltip title={polyglot.t(`column_tooltip`)}>
                    <GridToolbarColumnsButton />
                </Tooltip>
                <GridToolbarFilterButton />
                <Tooltip title={polyglot.t(`density_tooltip`)}>
                    <GridToolbarDensitySelector />
                </Tooltip>
                <Tooltip title={polyglot.t(`add_more_data`)}>
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
                        {polyglot.t('add_more')}
                    </Button>
                </Tooltip>
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
                paginationMode="server"
                onPageChange={onPageChange}
                onPageSizeChange={setLimit}
                sortingMode="server"
                onSortModelChange={handleSortModelChange}
                filterMode="server"
                onFilterModelChange={handleFilterModelChange}
                rowsPerPageOptions={[10, 25, 50]}
                disableSelectionOnClick={true}
                onCellClick={handleCellClick}
                components={{
                    Footer: CustomFooter,
                    Toolbar: CustomToolbar,
                }}
                componentsProps={{
                    panel: {
                        sx: {
                            // hide delete-row in column hide/display panel
                            '& .MuiDataGrid-columnsPanelRow:first-child': {
                                display: 'none',
                            },
                        },
                    },
                }}
                sx={{
                    [`& .${gridClasses.columnHeaderTitleContainer} .${gridClasses.iconButtonContainer}`]: {
                        visibility: 'visible',
                        width: 'auto',
                    },
                    // hide the `delete-row` column and disable the `delete-row` button on row hover
                    [`& .${gridClasses.row} .${gridClasses.cellWithRenderer} .${gridClasses.iconButtonContainer}`]: {
                        visibility: 'hidden',
                    },
                    [`& .MuiDataGrid-columnHeader[data-field="delete-row"]`]: {
                        display: 'none',
                    },
                    [`& .MuiDataGrid-cell[data-field="delete-row"]`]: {
                        position: 'absolute',
                        left: 0,
                        visibility: 'hidden',
                        opacity: 0,
                        transform: 'translateX(-100%)',
                        backgroundColor: 'contrast.main',
                    },
                    [`& .MuiDataGrid-row:hover > .MuiDataGrid-cell[data-field="delete-row"]`]: {
                        visibility: 'visible',
                        transition: 'all 0.3s ease-in-out',
                        opacity: 1,
                        transform: 'translateX(0)',
                    },
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
            <ParsingDeleteRowDialogComponent
                isOpen={openDialogDeleteRow}
                handleClose={() => setOpenDialogDeleteRow(false)}
                selectedRowForDelete={selectedRowForDelete}
                reloadDataset={() => fetchDataset()}
                shouldRepublish={isPublished}
            />
        </Box>
    );
};

ParsingResultComponent.propTypes = {
    p: polyglotPropTypes.isRequired,
    loadingParsingResult: PropTypes.bool.isRequired,
    enrichments: PropTypes.arrayOf(PropTypes.object),
    isPublished: PropTypes.bool.isRequired,
};

const mapStateToProps = state => ({
    loadingParsingResult: fromParsing.isParsingLoading(state),
    enrichments: fromEnrichments.enrichments(state),
    isPublished: fromPublication.hasPublishedDataset(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(ParsingResultComponent);
