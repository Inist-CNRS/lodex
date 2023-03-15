import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import { CircularProgress, Button } from '@mui/material';

import {
    facetActions,
    search as searchAction,
    sort as sortAction,
    loadMore as loadMoreAction,
} from './reducer';
import {
    polyglot as polyglotPropTypes,
    field as fieldPropTypes,
    resource as resourcePropTypes,
} from '../../propTypes';
import { preLoadPublication as preLoadPublicationAction } from '../../fields';
import { fromFields } from '../../sharedSelectors';
import { fromSearch, fromDataset } from '../selectors';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import stylesToClassname from '../../lib/stylesToClassName';
import AppliedFacetList from './AppliedSearchFacetList';
import FacetList from '../facet/FacetList';
import SearchResultList from './SearchResultList';
import SearchResultSort from './SearchResultSort';
import SearchSearchBar from './SearchSearchBar';
import customTheme from '../../../custom/customTheme';
import SearchResultHeader from './SearchResultHeader';

const styles = stylesToClassname(
    {
        container: {
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
        },
        advanced: {
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
        },
        content: {
            backgroundColor: customTheme.palette.neutralDark.veryLight,
            '@media (min-width: 992px)': {
                display: 'flex',
            },
        },
        results: {
            opacity: '1',
            transition: 'opacity 300ms ease-in-out',
            '@media (min-width: 992px)': {
                padding: '0rem calc(1rem + 12px)',
                minWidth: '600px',
                flex: 3,
            },
        },
        resultsOpening: {
            opacity: '0',
        },
        loading: {
            marginRight: '1rem',
            marginTop: '-0.2rem',
        },
        loadMore: {
            height: 36,
            marginTop: '1rem',
        },
        noResult: {
            padding: '10% 0',
            textAlign: 'center',
        },
    },
    'search',
);

class Search extends Component {
    state = {
        opening: true,
        showFacets: false,
    };

    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        const {
            searchQuery,
            search,
            results,
            preLoadPublication,
            withDataset,
            datasetSearchTerm,
            datasetFacetsValues,
            datasetAppliedFacets,
            datasetInvertedFacets,
            datasetOpenedFacets,
            setFacets,
        } = this.props;

        if (withDataset) {
            setFacets({
                facetsValues: datasetFacetsValues,
                appliedFacets: datasetAppliedFacets,
                invertedFacets: datasetInvertedFacets,
                openedFacets: datasetOpenedFacets,
            });
            preLoadPublication();
            search({ query: datasetSearchTerm || '' });
        } else if (!results || results.length === 0) {
            preLoadPublication();
            search({ query: searchQuery || '' });
        }

        setTimeout(() => {
            this.setState({ opening: false });
        }, 300);
    }

    handleToggleFacets = () => {
        const { showFacets } = this.state;
        this.setState({ showFacets: !showFacets });
    };

    handleSort = ({ sortBy }) => {
        const { sort } = this.props;
        sort({ sortBy });
    };

    renderNoResults = () => {
        const { p: polyglot } = this.props;

        return (
            <div className={styles.noResult}>
                <div>
                    <strong>{polyglot.t('no_result')}</strong>
                </div>
                <div>{polyglot.t('no_result_details')}</div>
            </div>
        );
    };

    renderNoOverviewField = () => {
        const { p: polyglot } = this.props;

        return (
            <AdminOnlyAlert>
                {polyglot.t('no_overview_field_error')}
            </AdminOnlyAlert>
        );
    };

    renderLoadMore = () => {
        const { loadMore, p: polyglot, results, total, loading } = this.props;

        return (
            <div className={classnames('load-more', styles.loadMore)}>
                {loading ? (
                    <>
                        <CircularProgress
                            variant="indeterminate"
                            size={20}
                            className={styles.loading}
                        />{' '}
                        {polyglot.t('loading')}
                    </>
                ) : (
                    <Button variant="text" fullWidth onClick={loadMore}>
                        {polyglot.t('search_load_more')} ({results.length} /{' '}
                        {total})
                    </Button>
                )}
            </div>
        );
    };

    render() {
        const { opening, showFacets } = this.state;
        const {
            className,
            sortBy,
            sortDir,
            loading,
            fieldNames,
            results,
            total,
            withFacets,
            fields,
            closeDrawer,
        } = this.props;

        const noOverviewField =
            !loading &&
            Object.values(fieldNames).filter(Boolean).length === 1 &&
            fieldNames.uri === 'uri';
        const noResults = !loading && !noOverviewField && results.length === 0;

        const everythingIsOk = !noOverviewField && !noResults;
        const canLoadMore = everythingIsOk && results.length < total;

        return (
            <div className={classnames(className, styles.container)}>
                <div className={styles.header}>
                    <SearchSearchBar />
                </div>
                {withFacets && <AppliedFacetList />}
                <div className={styles.content}>
                    {withFacets && (
                        <FacetList
                            className="search-facets"
                            page="search"
                            open={showFacets}
                        />
                    )}
                    <div
                        className={classnames(styles.results, {
                            [styles.resultsOpening]: opening,
                        })}
                    >
                        {noOverviewField && this.renderNoOverviewField()}
                        {noResults && this.renderNoResults()}
                        {(everythingIsOk || loading) && (
                            <>
                                <SearchResultHeader
                                    displayStats={everythingIsOk || noResults}
                                    withFacets={withFacets}
                                    onToggleFacets={this.handleToggleFacets}
                                    sortComponent={
                                        <SearchResultSort
                                            fields={fields}
                                            fieldNames={fieldNames}
                                            sort={this.handleSort}
                                            sortBy={sortBy}
                                            sortDir={sortDir}
                                        />
                                    }
                                />
                                <SearchResultList
                                    results={results}
                                    fields={fields}
                                    fieldNames={fieldNames}
                                    closeDrawer={closeDrawer}
                                    placeholders={loading}
                                />
                            </>
                        )}
                        {canLoadMore && this.renderLoadMore()}
                    </div>
                </div>
            </div>
        );
    }
}

Search.propTypes = {
    className: PropTypes.string,
    search: PropTypes.func.isRequired,
    searchQuery: PropTypes.string,
    sort: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired,
    sortDir: PropTypes.oneOf(['ASC', 'DESC']).isRequired,
    preLoadPublication: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    p: polyglotPropTypes.isRequired,
    results: PropTypes.arrayOf(resourcePropTypes).isRequired,
    fieldNames: PropTypes.shape({
        uri: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
    }).isRequired,
    fields: PropTypes.arrayOf(fieldPropTypes).isRequired,
    loadMore: PropTypes.func.isRequired,
    total: PropTypes.number.isRequired,
    closeDrawer: PropTypes.func.isRequired,
    withFacets: PropTypes.bool.isRequired,
    withDataset: PropTypes.bool.isRequired,
    setFacets: PropTypes.func.isRequired,
    datasetSearchTerm: PropTypes.string,
    datasetFacetsValues: PropTypes.object,
    datasetAppliedFacets: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool,
            ]),
        ),
    ),
    datasetInvertedFacets: PropTypes.objectOf(
        PropTypes.arrayOf(
            PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.bool,
            ]),
        ),
    ),
    datasetOpenedFacets: PropTypes.objectOf(PropTypes.bool),
};

Search.defaultProps = {
    searchQuery: null,
};

const mapStateToProps = state => {
    const { sortBy, sortDir } = fromSearch.getSort(state);

    return {
        loading: fromSearch.isLoading(state),
        results: fromSearch.getDataset(state),
        fieldNames: fromSearch.getFieldNames(state),
        fields: fromFields.getFields(state),
        total: fromSearch.getTotal(state),
        searchQuery: fromSearch.getQuery(state),
        sortBy,
        sortDir,
        datasetSearchTerm: fromDataset.getFilter(state),
        datasetFacetsValues: fromDataset.getFacetsValues(state),
        datasetAppliedFacets: fromDataset.getAppliedFacets(state),
        datasetInvertedFacets: fromDataset.getInvertedFacets(state),
        datasetOpenedFacets: fromDataset.getOpenedFacets(state),
    };
};

const mapDispatchToProps = {
    search: searchAction,
    sort: sortAction,
    preLoadPublication: preLoadPublicationAction,
    loadMore: loadMoreAction,
    setFacets: facetActions.setFacets,
};

export default compose(
    translate,
    connect(mapStateToProps, mapDispatchToProps),
)(Search);
