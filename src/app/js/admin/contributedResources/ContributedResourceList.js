import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import FlatButton from 'material-ui/FlatButton';
import { CardText } from 'material-ui/Card';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
} from 'material-ui/Table';

import Loading from '../../lib/components/Loading';
import Pagination from '../../lib/components/Pagination';
import { polyglot as polyglotPropTypes } from '../../propTypes';
import {
    loadContributedResourcePage as
    loadContributedResourcePageAction,
    restoreRessource as restoreRessourceAction,
    changeContributedResourceFilter,
} from './';

import { fromContributedResources, fromFields } from '../selectors';
import propositionStatus from '../../../../common/propositionStatus';
import { getFullResourceUri } from '../../../../common/uris';

const styles = {
    table: {
        width: 'auto',
        minWidth: '100%',
    },
    select: {
        width: null,
    },
};

export class ContributedResourceListComponent extends Component {
    componentWillMount() {
        const { loadContributedResourcePage, currentPage, filter } = this.props;
        loadContributedResourcePage({ page: currentPage, perPage: 10, filter });
    }

    handlePageChange = (currentPage, perPage) => {
        this
            .props
            .loadContributedResourcePage({ page: currentPage, perPage, filter: this.props.filter });
    }

    render() {
        const {
            columns,
            resources,
            loading, p:
            polyglot,
            total,
            filter,
            onChangeFilter,
            currentPage,
        } = this.props;

        if (loading) {
            return <Loading>{polyglot.t('loading')}</Loading>;
        }

        const baseUri = `${window.location.protocol}//${window.location.host}`;

        return (
            <div className="contributed_resources">
                <CardText>
                    <SelectField
                        className="filter"
                        style={styles.select}
                        autoWidth
                        value={filter}
                        onChange={(_, __, value) => onChangeFilter(value)}
                    >
                        {propositionStatus.map(status => (
                            <MenuItem
                                key={status}
                                className={`filter_${status}`}
                                value={status}
                                primaryText={polyglot.t('contribution_filter', { status: polyglot.t(status) })}
                            />
                        ))}
                    </SelectField>
                </CardText>

                <CardText>
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
                                        <a
                                            href={getFullResourceUri(data, baseUri)}
                                        >
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
                        currentPage={currentPage}
                        texts={{
                            page: polyglot.t('page'),
                            perPage: polyglot.t('perPage'),
                            showing: polyglot.t('showing'),
                        }}
                    />
                </CardText>
            </div>
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
    loadContributedResourcePage: PropTypes.func.isRequired,
    p: polyglotPropTypes.isRequired,
    total: PropTypes.number.isRequired,
    filter: PropTypes.oneOf(propositionStatus).isRequired,
    onChangeFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
    loading: fromContributedResources.isContributedResourceLoading(state),
    columns: fromFields.getCollectionFields(state),
    currentPage: fromContributedResources.getContributedResourceCurrentPage(state),
    resources: fromContributedResources.getContributedResourceItems(state),
    total: fromContributedResources.getContributedResourceTotal(state),
    filter: fromContributedResources.getContributedResourceFilter(state),
});

const mapDispatchToProps = ({
    loadContributedResourcePage: loadContributedResourcePageAction,
    restoreRessource: restoreRessourceAction,
    onChangeFilter: changeContributedResourceFilter,
});

export default compose(connect(mapStateToProps, mapDispatchToProps), translate)(ContributedResourceListComponent);
