import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import moment from 'moment';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

import ButtonWithStatus from '../../lib/components/ButtonWithStatus';
import Loading from '../../lib/components/Loading';
import Pagination from '../../lib/components/Pagination';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    loadRemovedResourcePage as loadRemovedResourcePageAction,
    restoreRessource as restoreRessourceAction,
} from './';

import { fromRemovedResources } from '../selectors';
import { fromFields } from '../../sharedSelectors';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
        overflowX: 'auto',
        display: 'block',
    },
};

export class RemovedResourceListComponent extends Component {
    UNSAFE_componentWillMount() {
        const { loadRemovedResourcePage, currentPage } = this.props;
        loadRemovedResourcePage({ page: currentPage, perPage: 10 });
    }

    handlePageChange = (currentPage, perPage) => {
        this.props.loadRemovedResourcePage({ page: currentPage, perPage });
    };

    handleRestoreResourceClick = id => () => {
        this.props.restoreRessource(id);
    };

    render() {
        const {
            columns,
            resources,
            loading,
            p: polyglot,
            total,
            currentPage,
        } = this.props;

        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;

        return (
            <Card className="removed_resources">
                <CardContent>
                    <Table
                        selectable={false}
                        fixedHeader={false}
                        style={styles.table}
                    >
                        <TableHead
                            displaySelectAll={false}
                            adjustForCheckbox={false}
                        >
                            <TableRow>
                                <TableCell>
                                    {polyglot.t('removed_at')}
                                </TableCell>
                                <TableCell>
                                    {polyglot.t('removed_reason')}
                                </TableCell>
                                <TableCell />
                                {columns.map(({ name, label }) => (
                                    <TableCell key={name}>{label}</TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody displayRowCheckbox={false}>
                            {resources.map(data => (
                                <TableRow key={data.uri}>
                                    <TableCell>
                                        {moment(data.removedAt).format('L')}
                                    </TableCell>
                                    <TableCell>{data.reason}</TableCell>
                                    <TableCell>
                                        <ButtonWithStatus
                                            variant="contained"
                                            className="btn-restore-resource"
                                            loading={loading}
                                            onClick={this.handleRestoreResourceClick(
                                                data.uri,
                                            )}
                                            primary
                                            data={data.uri}
                                        >
                                            {polyglot.t('restore')}
                                        </ButtonWithStatus>
                                    </TableCell>
                                    {columns.map(({ name }) => (
                                        <TableCell key={data[name]}>
                                            {data[name]}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                    <Pagination
                        onChange={this.handlePageChange}
                        total={total}
                        perPage={10}
                        currentPage={currentPage}
                        texts={{
                            page: polyglot.t('page'),
                            perPage: polyglot.t('perPage'),
                            showing: polyglot.t('showing'),
                        }}
                    />
                </CardContent>
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
    loading: fromRemovedResources.isRemovedResourceLoading(state),
    columns: fromFields.getCollectionFields(state),
    currentPage: fromRemovedResources.getRemovedResourceCurrentPage(state),
    resources: fromRemovedResources.getRemovedResourceItems(state),
    total: fromRemovedResources.getRemovedResourceTotal(state),
});

const mapDispatchToProps = {
    loadRemovedResourcePage: loadRemovedResourcePageAction,
    restoreRessource: restoreRessourceAction,
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    translate,
)(RemovedResourceListComponent);
