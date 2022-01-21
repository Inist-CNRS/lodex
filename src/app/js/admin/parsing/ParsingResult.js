import React, { useEffect, useState } from 'react';
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

const ParsingResultComponent = props => {
    const { p: polyglot } = props;
    const [columns, setColumns] = useState([]);
    const [rows, setRows] = useState([]);
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(10);
    const [filter, setFilter] = useState({});

    useEffect(() => {
        const fetchDataset = async () => {
            const datas = await datasetApi.getDataset({ skip, limit, filter });
            if (datas.length !== 0) {
                setColumns(
                    Object.keys(datas[0])
                        .filter(key => key !== '_id')
                        .map(key => ({
                            field: key,
                            headerName: key,
                        })),
                );
                setRows(datas.map(data => ({ id: data._id, ...data })));
            }
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
            <DataGrid columns={columns} rows={rows} />
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
