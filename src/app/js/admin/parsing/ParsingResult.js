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
} from '@mui/x-data-grid';
import { IN_PROGRESS } from '../../../../common/enrichmentStatus';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import RefreshIcon from '@material-ui/icons/Refresh';
import classnames from 'classnames';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { fromEnrichments, fromParsing } from '../selectors';
import datasetApi from '../api/dataset';
import Loading from '../../lib/components/Loading';
import ParsingExcerpt from './ParsingExcerpt';
import colorsTheme from '../../../custom/colorsTheme';
import { makeStyles } from '@material-ui/styles';
import {
    Box,
    Chip,
    CircularProgress,
    Drawer,
    IconButton,
    Tooltip,
} from '@material-ui/core';
import { TablePagination } from '@mui/material';
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
    header: {
        backgroundColor: colorsTheme.black.veryLight,
    },
    enrichedColumn: {
        backgroundColor: colorsTheme.green.light,
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
        backgroundColor: colorsTheme.black.veryLight,
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
        backgroundColor: colorsTheme.red.primary,
        color: colorsTheme.white.primary,
    },
    errorHeader: {
        color: colorsTheme.orange.primary,
    },
};

const useStyles = makeStyles(styles);

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
        excerptColumns,
        excerptLines,
        maxLines,
        showAddFromColumn,
        onAddField,
        dataGrid,
        enrichments,
        loadingParsingResult,
    } = props;

    const classes = useStyles();
    const [showEnrichmentColumns, setShowEnrichmentColumns] = useState(true);
    const [showMainColumns, setShowMainColumns] = useState(true);

    const [datas, setDatas] = useState([]);
    const [columns, setColumns] = useState([]);
    const [toggleDrawer, setToggleDrawer] = useState(false);
    const [selectedCell, setSelectedCell] = useState(null);

    const getColumnsToShow = () => {
        const enrichmentsNames = enrichments.map(enrichment => enrichment.name);

        return columns
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
                    headerClassName: errorCount && classes.errorHeader,
                    cellClassName: isEnrichment && classes.enrichedColumn,
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
                                    style={styles.progress}
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
                                <Chip
                                    className={classes.errorChip}
                                    label="Error"
                                />
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
            if (!datas || datas.length === 0 || !enrichments) return 0;
            return Object.keys(datas[0]).filter(key => {
                const isEnrichmentColumn = enrichments.some(
                    enrichment => enrichment.name === key,
                );
                switch (columnType) {
                    case COLUMN_TYPE.MAIN:
                        return !isEnrichmentColumn;
                    case COLUMN_TYPE.ENRICHMENT:
                        return isEnrichmentColumn;
                    default:
                        return false;
                }
            }).length;
        },
        [datas, enrichments],
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
            <div className={classes.footer}>
                <div className={classes.columnToggle}>
                    <Box
                        className={classnames(
                            classes.footerItem,
                            classes.toggle,
                        )}
                        onClick={() => {
                            setShowMainColumns(!showMainColumns);
                        }}
                    >
                        <div className={classes.footerItemText}>
                            {polyglot.t('parsing_summary_columns', {
                                smart_count: numberOfColumns(COLUMN_TYPE.MAIN),
                            })}
                        </div>
                        <Tooltip title={polyglot.t(`toggle_loaded`)}>
                            {showMainColumns ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Tooltip>
                    </Box>

                    <Box
                        className={classnames(
                            classes.enrichedColumn,
                            classes.footerItem,
                            classes.toggle,
                        )}
                        onClick={() => {
                            setShowEnrichmentColumns(!showEnrichmentColumns);
                        }}
                    >
                        <div className={classes.footerItemText}>
                            {polyglot.t('parsing_enriched_columns', {
                                smart_count: numberOfColumns(
                                    COLUMN_TYPE.ENRICHMENT,
                                ),
                            })}
                        </div>
                        <Tooltip title={polyglot.t(`toggle_enriched`)}>
                            {showEnrichmentColumns ? (
                                <VisibilityIcon />
                            ) : (
                                <VisibilityOffIcon />
                            )}
                        </Tooltip>
                    </Box>
                </div>
                <Box display="flex">
                    <Tooltip title={polyglot.t(`refresh_button`)}>
                        <IconButton onClick={() => fetchDataset()}>
                            <RefreshIcon />
                        </IconButton>
                    </Tooltip>
                    <TablePagination
                        count={rowCount}
                        page={skip / limit}
                        rowsPerPage={limit}
                        onPageChange={(e, page) => onPageChange(page)}
                        rowsPerPageOptions={[25, 50, 100]}
                        labelRowsPerPage={polyglot.t('rows_per_page')}
                        onRowsPerPageChange={rpp => {
                            setLimit(rpp.target.value);
                        }}
                    />
                </Box>
            </div>
        );
    };

    return (
        <div className={classes.container}>
            {dataGrid ? (
                <React.Fragment>
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
                        }}
                    />
                    <Drawer
                        anchor="right"
                        open={toggleDrawer}
                        onClose={() => setToggleDrawer(false)}
                        className={classes.drawer}
                        classes={{
                            paper: classes.drawer,
                        }}
                    >
                        {selectedCell ? (
                            <ParsingEditCell
                                cell={selectedCell}
                                setToggleDrawer={setToggleDrawer}
                            />
                        ) : null}
                    </Drawer>
                </React.Fragment>
            ) : (
                <ParsingExcerpt
                    columns={excerptColumns}
                    lines={excerptLines.slice(0, maxLines)}
                    showAddFromColumn={showAddFromColumn}
                    onAddField={onAddField}
                />
            )}
        </div>
    );
};

ParsingResultComponent.propTypes = {
    excerptColumns: PropTypes.arrayOf(PropTypes.string).isRequired,
    excerptLines: PropTypes.arrayOf(PropTypes.object).isRequired,
    p: polyglotPropTypes.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    onAddField: PropTypes.func,
    maxLines: PropTypes.number,
    loadingParsingResult: PropTypes.bool.isRequired,
    dataGrid: PropTypes.bool,
    enrichments: PropTypes.arrayOf(PropTypes.object),
};

ParsingResultComponent.defaultProps = {
    maxLines: 10,
    showAddFromColumn: false,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
    enrichments: fromEnrichments.enrichments(state),
});

export default compose(
    connect(mapStateToProps),
    translate,
)(ParsingResultComponent);
