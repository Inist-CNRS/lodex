import React, { useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import compose from 'recompose/compose';
import { connect } from 'react-redux';
import translate from 'redux-polyglot/translate';
import { grey } from '@material-ui/core/colors';
import { DataGrid } from '@mui/x-data-grid';

import { polyglot as polyglotPropTypes } from '../../propTypes';
import { reloadParsingResult } from './';
import { fromParsing } from '../selectors';
import datasetApi from '../api/dataset';
import Loading from '../../lib/components/Loading';
import ParsingExcerpt from './ParsingExcerpt';
import { useAdminContext } from '../AdminContext';

const styles = {
    container: {
        position: 'relative',
        height: '645px',
        width: '100%',
        display: 'flex',
        maxHeight: 'calc(((100vh - 100px) - 76px) - 72px)',
    },
    card: {
        marginTop: 0,
    },
    content: {
        overflow: 'auto',
        display: 'flex',
    },
    list: {
        borderRight: `solid 1px ${grey[400]}`,
        listStyleType: 'none',
        margin: 0,
        padding: 0,
        paddingRight: '1rem',
    },
    listItem: {
        whiteSpace: 'nowrap',
    },
    button: {
        float: 'right',
        marginRight: '2rem',
    },
};

const getColumnsToShow = datas => {
    if (datas.length === 0) return [];

    return Object.keys(datas[0])
        .filter(key => key !== '_id')
        .map(key => ({
            field: key,
            headerName: key,
        }));
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
    } = props;
    const [datas, setDatas] = useState([]);

    const columns = useMemo(
        () => getColumnsToShow(datas, showEnrichmentColumns, showMainColumns),
        [datas, showEnrichmentColumns, showMainColumns],
    );
    const rows = useMemo(() => datas.map(data => ({ id: data._id, ...data })), [
        datas,
    ]);
    const [rowCount, setRowCount] = useState(0);

    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filter, setFilter] = useState({});

    const adminContext = useAdminContext();
    const showEnrichmentColumns = adminContext?.showEnrichmentColumns;
    const showMainColumns = adminContext?.showMainColumns;

    const onPageChange = page => {
        setSkip(page * limit);
    };

    useEffect(() => {}, [showEnrichmentColumns, showMainColumns]);
    useEffect(() => {
        const fetchDataset = async () => {
            const { count: datasCount, datas } = await datasetApi.getDataset({
                skip,
                limit,
                filter,
            });
            setRowCount(datasCount);
            setDatas(datas);
        };
        fetchDataset();
    }, [skip, limit, filter]);

    if (rows.length === 0) {
        return (
            <Loading className="admin">
                {polyglot.t('loading_parsing_results')}
            </Loading>
        );
    }

    return (
        <div className="parsingResult" style={styles.container}>
            {dataGrid ? (
                <DataGrid
                    columns={columns}
                    rows={rows}
                    rowCount={rowCount}
                    autoPageSize
                    disableColumnFilter
                    disableColumnMenu
                    pageSize={10}
                    paginationMode="server"
                    onPageChange={onPageChange}
                />
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
    handleClearParsing: PropTypes.func.isRequired,
    showAddFromColumn: PropTypes.bool.isRequired,
    onAddField: PropTypes.func,
    maxLines: PropTypes.number,
    loadingParsingResult: PropTypes.bool.isRequired,
    dataGrid: PropTypes.bool,
};

ParsingResultComponent.defaultProps = {
    maxLines: 10,
    showAddFromColumn: false,
};

const mapStateToProps = state => ({
    excerptColumns: fromParsing.getParsedExcerptColumns(state),
    excerptLines: fromParsing.getExcerptLines(state),
    loadingParsingResult: fromParsing.isParsingLoading(state),
});

const mapDispatchToProps = {
    handleClearParsing: reloadParsingResult,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(ParsingResultComponent);
