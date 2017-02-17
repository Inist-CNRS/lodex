import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import moment from 'moment';

import { CardHeader, CardText } from 'material-ui/Card';

import {
    Table,
    TableBody,
    TableFooter,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import ButtonWithStatus from '../../lib/ButtonWithStatus';
import Card from '../../lib/Card';
import Loading from '../../lib/Loading';
import Pagination from '../../lib/Pagination';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    loadRemovedResourcePage as loadRemovedResourcePageAction,
    restoreRessource as restoreRessourceAction,
    isRemovedResourceLoading,
    getRemovedResourceCurrentPage,
    getRemovedResourceTotal,
    getRemovedResourceItems,
} from './';
import { getCollectionFields } from '../../public';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
    },
};

export class RemovedResourceListComponent extends Component {
    componentWillMount() {
        const { loadRemovedResourcePage, currentPage } = this.props;
        loadRemovedResourcePage({ page: currentPage, perPage: 10 });
    }

    handlePageChange = (currentPage, perPage) => {
        this.props.loadRemovedResourcePage({ page: currentPage, perPage });
    }

    handleRestoreResourceClick = id => () => {
        this.props.restoreRessource(id);
    }

    render() {
        const { columns, resources, loading, p: polyglot, total } = this.props;

        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;

        return (
            <Card className="removed_resources">
                <CardHeader title={polyglot.t('removed_resources')} />
                <CardText>
                    <Table selectable={false} fixedHeader={false} style={styles.table}>
                        <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                            <TableRow>
                                <TableHeaderColumn>{polyglot.t('removed_at')}</TableHeaderColumn>
                                <TableHeaderColumn>{polyglot.t('removed_reason')}</TableHeaderColumn>
                                {columns.map(c => <TableHeaderColumn>{c.name}</TableHeaderColumn>)}
                                <TableHeaderColumn />
                            </TableRow>
                        </TableHeader>
                        <TableBody displayRowCheckbox={false}>
                            {resources.map(data => (
                                <TableRow>
                                    <TableRowColumn>{moment(data.removedAt).format('L')}</TableRowColumn>
                                    <TableRowColumn>{data.reason}</TableRowColumn>
                                    {columns.map(({ name }) => (
                                        <TableRowColumn>{data[name]}</TableRowColumn>
                                    ))}
                                    <TableRowColumn>
                                        <ButtonWithStatus
                                            className="btn-restore-resource"
                                            loading={loading}
                                            label={polyglot.t('restore')}
                                            onClick={this.handleRestoreResourceClick(data.uri)}
                                            primary
                                            data={data.uri}
                                        />
                                    </TableRowColumn>
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

RemovedResourceListComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentPage: PropTypes.number.isRequired,
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    loadRemovedResourcePage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    restoreRessource: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    loading: isRemovedResourceLoading(state),
    columns: getCollectionFields(state),
    currentPage: getRemovedResourceCurrentPage(state),
    resources: getRemovedResourceItems(state),
    total: getRemovedResourceTotal(state),
});

const mapDispatchToProps = ({
    loadRemovedResourcePage: loadRemovedResourcePageAction,
    restoreRessource: restoreRessourceAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(RemovedResourceListComponent);
