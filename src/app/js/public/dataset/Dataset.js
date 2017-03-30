import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import { CardActions } from 'material-ui/Card';

import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import DatasetColumn from './DatasetColumn';
import DatasetColumnHeader from './DatasetColumnHeader';
import Pagination from '../../lib/Pagination';
import Loading from '../../lib/Loading';
import ScrollableCardContent from '../../lib/ScrollableCardContent';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { loadDatasetPage as loadDatasetPageAction } from './';
import { fromPublication, fromDataset } from '../selectors';
import AddCharacteristic from '../characteristic/AddCharacteristic';

const styles = {
    table: {
        display: 'block',
        overflowX: 'auto',
        width: 'auto',
    },
    wrapper: {
        maxWidth: '100%',
    },
    noResult: {
        textAlign: 'center',
    },
};

export class DatasetComponent extends Component {
    componentWillMount() {
        const { loadDatasetPage, currentPage, perPage } = this.props;
        loadDatasetPage({ page: currentPage, perPage });
    }

    handlePageChange = (page, perPage) => {
        this.props.loadDatasetPage({ page, perPage });
    }

    render() {
        const { columns, dataset, loading, p: polyglot, total, perPage, currentPage } = this.props;
        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <ScrollableCardContent className="dataset" style={styles.wrapper}>
                <Table selectable={false} fixedHeader={false} style={styles.table}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            {columns.map(c => <DatasetColumnHeader
                                key={c.name}
                                name={c.name}
                                label={c.label}
                            />)}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {!dataset.length ? (
                            <TableRow>
                                <TableRowColumn>{polyglot.t('no_result')}</TableRowColumn>
                            </TableRow>
                        ) : (
                            dataset.map(data => (
                                <TableRow key={data.uri}>
                                    {columns.map(column => (
                                        <DatasetColumn
                                            key={column.name}
                                            column={column}
                                            columns={columns}
                                            resource={data}
                                        />
                                    ))}
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination
                    onChange={this.handlePageChange}
                    total={total}
                    perPage={perPage}
                    currentPage={currentPage}
                    texts={{
                        page: polyglot.t('page'),
                        perPage: polyglot.t('perPage'),
                        showing: polyglot.t('showing'),
                    }}
                />
                <CardActions style={styles.actions}>
                    <AddCharacteristic />
                </CardActions>
            </ScrollableCardContent>
        );
    }
}

DatasetComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object),
    loadDatasetPage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
};

DatasetComponent.defaultProps = {
    columns: [],
    dataset: [],
};

const mapStateToProps = state => ({
    loading: fromDataset.isDatasetLoading(state),
    columns: fromPublication.getListFields(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
    dataset: fromDataset.getDataset(state),
    total: fromDataset.getDatasetTotal(state),
});

const mapDispatchToProps = ({
    loadDatasetPage: loadDatasetPageAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetComponent);
