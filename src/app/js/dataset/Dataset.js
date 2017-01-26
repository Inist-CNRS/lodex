import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { compose } from 'recompose';
import translate from 'redux-polyglot/translate';

import { Card, CardText } from 'material-ui/Card';
import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';
import Pagination from './Pagination';

import { polyglot as polyglotPropTypes } from '../lib/propTypes';
import { loadDatasetPage as loadDatasetPageAction } from './';
import { getColumns } from '../publication';

class DatasetComponent extends Component {
    componentDidMount() {
        const { loadDatasetPage, currentPage } = this.props;
        loadDatasetPage({ page: currentPage, perPage: 20 });
    }

    handlePageChange = (currentPage, perPage) => {
        this.props.loadDatasetPage({ page: currentPage, perPage });
    }

    render() {
        const { columns, dataset, p: polyglot, total } = this.props;
        return (
            <Card>
                <CardText>
                    <Table selectable={false} fixedHeader={false} style={{ width: 'auto' }}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                {columns.map(c => <TableHeaderColumn>{c.name}</TableHeaderColumn>)}
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {dataset.map(data => (
                                <TableRow>
                                    {columns.map(c => <TableRowColumn>{data[c.name]}</TableRowColumn>)}
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <Pagination
                                onChange={this.handlePageChange}
                                total={total}
                                perPage={10}
                                texts={{
                                    page: polyglot.t('page'),
                                    perPage: polyglot.t('perPage'),
                                    showing: polyglot.t('showing'),
                                }}
                            />
                        </TableFooter>
                    </Table>
                </CardText>
            </Card>
        );
    }
}

DatasetComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentPage: PropTypes.number.isRequired,
    dataset: PropTypes.arrayOf(PropTypes.object).isRequired,
    loadDatasetPage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    loading: state.publication.loading,
    columns: getColumns(state),
    currentPage: state.dataset.currentPage,
    dataset: state.dataset.dataset,
    total: state.dataset.total,
});

const mapDispatchToProps = ({
    loadDatasetPage: loadDatasetPageAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(DatasetComponent);
