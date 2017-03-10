import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
} from 'material-ui/Table';
import DatasetColumn from './DatasetColumn';
import Pagination from '../../lib/Pagination';
import Card from '../../lib/Card';
import Loading from '../../lib/Loading';
import ScrollableCardContent from '../../lib/ScrollableCardContent';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { loadDatasetPage as loadDatasetPageAction } from './';
import { fromPublication, fromDataset } from '../selectors';

const styles = {
    table: {
        width: 'auto',
    },
    wrapper: {
        overflowX: 'auto',
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

    handlePageChange = (currentPage, perPage) => {
        this.props.loadDatasetPage({ page: currentPage, perPage });
    }

    render() {
        const { columns, dataset, loading, p: polyglot, total, perPage, currentPage } = this.props;
        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <Card className="dataset">
                <ScrollableCardContent>
                    <Table selectable={false} fixedHeader={false} bodyStyle={styles.wrapper} style={styles.table}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {columns.map(c => <TableHeaderColumn key={c.name}>{c.label}</TableHeaderColumn>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {!dataset.length ? (
                                <div>{polyglot.t('no_result')}</div>
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
                </ScrollableCardContent>
            </Card>
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
    filtering: fromDataset.isDatasetFiltering(state),
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
