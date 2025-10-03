// @ts-expect-error TS6133
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import moment from 'moment';

import {
    CardContent,
    Table,
    TableBody,
    TableHead,
    TableCell,
    TableRow,
} from '@mui/material';

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
import { translate } from '../../i18n/I18NContext';

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
        // @ts-expect-error TS2339
        const { loadRemovedResourcePage, currentPage } = this.props;
        loadRemovedResourcePage({ page: currentPage, perPage: 10 });
    }

    // @ts-expect-error TS7006
    handlePageChange = (currentPage, perPage) => {
        // @ts-expect-error TS2339
        this.props.loadRemovedResourcePage({ page: currentPage, perPage });
    };

    // @ts-expect-error TS7006
    handleRestoreResourceClick = (id) => () => {
        // @ts-expect-error TS2339
        this.props.restoreRessource(id);
    };

    render() {
        const {
            // @ts-expect-error TS2339
            columns,
            // @ts-expect-error TS2339
            resources,
            // @ts-expect-error TS2339
            loading,
            // @ts-expect-error TS2339
            p: polyglot,
            // @ts-expect-error TS2339
            total,
            // @ts-expect-error TS2339
            currentPage,
        } = this.props;

        if (loading) return <Loading>{polyglot.t('loading')}</Loading>;

        return (
            <CardContent className="hidden_resources">
                <Table sx={styles.table}>
                    <TableHead>
                        <TableRow>
                            <TableCell>{polyglot.t('removed_at')}</TableCell>
                            <TableCell>
                                {polyglot.t('removed_reason')}
                            </TableCell>
                            <TableCell />
                            {/*
                             // @ts-expect-error TS7031 */}
                            {columns.map(({ name, label }) => (
                                <TableCell key={name}>{label}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {/*
                         // @ts-expect-error TS7006 */}
                        {resources.map((data) => (
                            <TableRow key={data.uri}>
                                <TableCell>
                                    {moment(data.removedAt).format('L')}
                                </TableCell>
                                <TableCell>{data.reason}</TableCell>
                                <TableCell>
                                    {/*
                                     // @ts-expect-error TS2739 */}
                                    <ButtonWithStatus
                                        raised
                                        className="btn-restore-resource"
                                        loading={loading}
                                        onClick={this.handleRestoreResourceClick(
                                            data.uri,
                                        )}
                                        color="primary"
                                        data={data.uri}
                                    >
                                        {polyglot.t('restore')}
                                    </ButtonWithStatus>
                                </TableCell>
                                {/*
                                 // @ts-expect-error TS7031 */}
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
        );
    }
}

// @ts-expect-error TS2339
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

// @ts-expect-error TS7006
const mapStateToProps = (state) => ({
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
    // @ts-expect-error TS2345
)(RemovedResourceListComponent);
