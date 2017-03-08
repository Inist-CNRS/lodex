import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import moment from 'moment';

import { CardText } from 'material-ui/Card';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import ButtonWithStatus from '../../lib/ButtonWithStatus';
import Loading from '../../lib/Loading';
import Pagination from '../../lib/Pagination';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    loadRemovedResourcePage as loadRemovedResourcePageAction,
    restoreRessource as restoreRessourceAction,
} from './';
import {
    loadField as loadFieldAction,
} from '../fields';

import { fromRemovedResources, fromFields } from '../selectors';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
    },
};

export class RemovedResourceListComponent extends Component {
    componentWillMount() {
        const { loadField, loadRemovedResourcePage, currentPage } = this.props;
        loadField();
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
            <CardText className="removed_resources">
                <Table selectable={false} fixedHeader={false} style={styles.table}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn>{polyglot.t('removed_at')}</TableHeaderColumn>
                            <TableHeaderColumn>{polyglot.t('removed_reason')}</TableHeaderColumn>
                            {columns.map(({ name, label }) =>
                                <TableHeaderColumn key={name}>{label}</TableHeaderColumn>)}
                            <TableHeaderColumn />
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {resources.map(data => (
                            <TableRow key={data.uri}>
                                <TableRowColumn>{moment(data.removedAt).format('L')}</TableRowColumn>
                                <TableRowColumn>{data.reason}</TableRowColumn>
                                {columns.map(({ name }) => (
                                    <TableRowColumn key={data[name]}>{data[name]}</TableRowColumn>
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
                </Table>
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
            </CardText>
        );
    }
}

RemovedResourceListComponent.propTypes = {
    columns: PropTypes.arrayOf(PropTypes.object).isRequired,
    currentPage: PropTypes.number.isRequired,
    resources: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
    loadRemovedResourcePage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    restoreRessource: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    loading: fromRemovedResources.isRemovedResourceLoading(state),
    columns: fromFields.getCollectionFields(state),
    currentPage: fromRemovedResources.getRemovedResourceCurrentPage(state),
    resources: fromRemovedResources.getRemovedResourceItems(state),
    total: fromRemovedResources.getRemovedResourceTotal(state),
});

const mapDispatchToProps = ({
    loadField: loadFieldAction,
    loadRemovedResourcePage: loadRemovedResourcePageAction,
    restoreRessource: restoreRessourceAction,
});

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(RemovedResourceListComponent);
