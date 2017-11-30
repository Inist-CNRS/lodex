import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import {
    Table,
    TableBody,
    TableHeader,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import DatasetColumn from './DatasetColumn';
import DatasetColumnHeader from './DatasetColumnHeader';
import Loading from '../../lib/components/Loading';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import { preLoadDatasetPage, changePage } from './';
import { fromDataset } from '../selectors';
import { fromFields } from '../../sharedSelectors';

const styles = {
    table: {
        display: 'block',
        overflowX: 'none',
        width: 'auto',
    },
};

export class DatasetComponent extends Component {
    componentWillMount() {
        const { currentPage, perPage } = this.props;
        this.props.preLoadDatasetPage({ page: currentPage, perPage });
    }

    handlePageChange = (page, perPage) => {
        this.props.changePage({ page, perPage });
    };

    render() {
        const { columns, dataset, loading, p: polyglot } = this.props;
        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;
        return (
            <Table selectable={false} fixedHeader={false} style={styles.table}>
                <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                    <TableRow>
                        {columns.map(c => (
                            <DatasetColumnHeader
                                key={c.name}
                                name={c.name}
                                label={c.label}
                            />
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>
                    {!dataset.length ? (
                        <TableRow>
                            <TableRowColumn>
                                {polyglot.t('no_result')}
                            </TableRowColumn>
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
        );
    }
}

DatasetComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object),
    currentPage: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object),
    preLoadDatasetPage: PropTypes.func.isRequired,
    changePage: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
};

DatasetComponent.defaultProps = {
    columns: [],
    dataset: [],
};

const mapStateToProps = state => ({
    loading: fromDataset.isDatasetLoading(state),
    columns: fromFields.getListFields(state),
    currentPage: fromDataset.getDatasetCurrentPage(state),
    perPage: fromDataset.getDatasetPerPage(state),
    dataset: fromDataset.getDataset(state).slice(0, 4),
    total: fromDataset.getDatasetTotal(state),
});

const mapDispatchToProps = {
    preLoadDatasetPage,
    changePage,
};

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(
    DatasetComponent,
);
