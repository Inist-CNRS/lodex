import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';

import { CardText } from 'material-ui/Card';

import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import Loading from '../../lib/Loading';
import Pagination from '../../lib/Pagination';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    loadContributedResourcePage as
    loadContributedResourcePageAction,
    restoreRessource as restoreRessourceAction,
} from './';
import { loadField as loadFieldAction } from '../fields';

import { fromContributedResources, fromFields } from '../selectors';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
    },
};

export class ContributedResourceListComponent extends Component {
    componentWillMount() {
        const { loadField, loadContributedResourcePage, currentPage } = this.props;
        loadField();
        loadContributedResourcePage({ page: currentPage, perPage: 10, status: 'VALIDATED' });
    }

    handlePageChange = (currentPage, perPage) => {
        this
            .props
            .loadContributedResourcePage({ page: currentPage, perPage, status: 'VALIDATED' });
    }

    render() {
        const { columns, resources, loading, p: polyglot, total } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }
        return (
            <CardText className="contributed_resources">
                <Table selectable={false} fixedHeader={false} style={styles.table}>
                    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
                        <TableRow>
                            <TableHeaderColumn />
                            {columns.map(({ name, label }) =>
                                <TableHeaderColumn key={name}>{label}</TableHeaderColumn>)}
                        </TableRow>
                    </TableHeader>
                    <TableBody displayRowCheckbox={false}>
                        {resources.map(data => (
                            <TableRow key={data.uri}>
                                <TableRowColumn key="review">
                                    <a href={`/#/resource?uri=${data.uri}`}>
                                        <FlatButton
                                            className="btn-review-resource"
                                            label={polyglot.t('review')}
                                            primary
                                        />
                                    </a>
                                </TableRowColumn>
                                {columns.map(({ name }) => (
                                    <TableRowColumn key={name}>{data[name]}</TableRowColumn>
                                ))}
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

ContributedResourceListComponent.propTypes = {
    columns: PropTypes
        .arrayOf(PropTypes.object)
        .isRequired,
    currentPage: PropTypes.number.isRequired,
    resources: PropTypes
        .arrayOf(PropTypes.object)
        .isRequired,
    loading: PropTypes.bool.isRequired,
    loadField: PropTypes.func.isRequired,
    loadContributedResourcePage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
};

const mapStateToProps = state => ({
    loading: fromContributedResources.isContributedResourceLoading(state),
    columns: fromFields.getCollectionFields(state),
    currentPage: fromContributedResources.getContributedResourceCurrentPage(state),
    resources: fromContributedResources.getContributedResourceItems(state),
    total: fromContributedResources.getContributedResourceTotal(state),
});

const mapDispatchToProps = ({
    loadField: loadFieldAction,
    loadContributedResourcePage: loadContributedResourcePageAction,
    restoreRessource: restoreRessourceAction,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(ContributedResourceListComponent);
