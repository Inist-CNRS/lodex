import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { translate } from '../../i18n/I18NContext';
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
import SearchResultHeader from './SearchResultHeader';

const styles = stylesToClassname(
    {
        container: {
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            marginBottom: '15px',
            gap: '1rem',
        },
        advanced: {
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
        },
        content: {
            backgroundColor: 'var(--neutral-dark-very-light)',
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

    // @ts-expect-error TS7006
    constructor(props) {
        super(props);
    }

    UNSAFE_componentWillMount() {
        const {
            // @ts-expect-error TS2339
            searchQuery,
            // @ts-expect-error TS2339
            search,
            // @ts-expect-error TS2339
            results,
            // @ts-expect-error TS2339
            preLoadPublication,
            // @ts-expect-error TS2339
            withDataset,
            // @ts-expect-error TS2339
            datasetSearchTerm,
            // @ts-expect-error TS2339
            datasetFacetsValues,
            // @ts-expect-error TS2339
            datasetAppliedFacets,
            // @ts-expect-error TS2339
            datasetInvertedFacets,
            // @ts-expect-error TS2339
            datasetOpenedFacets,
            // @ts-expect-error TS2339
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

    // @ts-expect-error TS7031
    handleSort = ({ sortBy }) => {
        // @ts-expect-error TS2339
        const { sort } = this.props;
        sort({ sortBy });
    };

    renderNoResults = () => {
        // @ts-expect-error TS2339
        const { p: polyglot } = this.props;

        return (
            // @ts-expect-error TS2339
            <div className={styles.noResult}>
                <div>
                    <strong>{polyglot.t('no_result')}</strong>
                </div>
                <div>{polyglot.t('no_result_details')}</div>
            </div>
        );
    };

    renderNoOverviewField = () => {
        // @ts-expect-error TS2339
        const { p: polyglot } = this.props;

        return (
            <AdminOnlyAlert>
                {polyglot.t('no_overview_field_error')}
            </AdminOnlyAlert>
        );
    };

    renderLoadMore = () => {
        // @ts-expect-error TS2339
        const { loadMore, p: polyglot, results, total, loading } = this.props;

        return (
            // @ts-expect-error TS2339
            <div className={classnames('load-more', styles.loadMore)}>
                {loading ? (
                    <>
                        <CircularProgress
                            variant="indeterminate"
                            size={20}
                            // @ts-expect-error TS2339
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
            // @ts-expect-error TS2339
            className,
            // @ts-expect-error TS2339
            sortBy,
            // @ts-expect-error TS2339
            sortDir,
            // @ts-expect-error TS2339
            loading,
            // @ts-expect-error TS2339
            fieldNames,
            // @ts-expect-error TS2339
            results,
            // @ts-expect-error TS2339
            total,
            // @ts-expect-error TS2339
            withFacets,
            // @ts-expect-error TS2339
            fields,
            // @ts-expect-error TS2339
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
            // @ts-expect-error TS2339
            <div className={classnames(className, styles.container)}>
                {/*
                 // @ts-expect-error TS2339 */}
                <div className={styles.header}>
                    {/*
                     // @ts-expect-error TS2741 */}
                    <SearchSearchBar
                        withFacets={withFacets}
                        onToggleFacets={this.handleToggleFacets}
                    />
                </div>
                {withFacets && <AppliedFacetList />}
                {/*
                 // @ts-expect-error TS2339 */}
                <div className={styles.content}>
                    {withFacets && (
                        <FacetList
                            // @ts-expect-error TS2322
                            className="search-facets"
                            page="search"
                            open={showFacets}
                        />
                    )}
                    <div
                        // @ts-expect-error TS2339
                        className={classnames(styles.results, {
                            // @ts-expect-error TS2339
                            [styles.resultsOpening]: opening,
                        })}
                    >
                        {noOverviewField && this.renderNoOverviewField()}
                        {noResults && this.renderNoResults()}
                        {(everythingIsOk || loading) && (
                            <>
                                <SearchResultHeader
                                    displayStats={everythingIsOk || noResults}
                                    // @ts-expect-error TS2322
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
                                    // @ts-expect-error TS2322
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

// @ts-expect-error TS2339
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

// @ts-expect-error TS2339
Search.defaultProps = {
    searchQuery: null,
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
    // @ts-expect-error TS2339
    const { sortBy, sortDir } = fromSearch.getSort(state);

    return {
        // @ts-expect-error TS2339
        loading: fromSearch.isLoading(state),
        // @ts-expect-error TS2339
        results: fromSearch.getDataset(state),
        // @ts-expect-error TS2339
        fieldNames: fromSearch.getFieldNames(state),
        // @ts-expect-error TS2339
        fields: fromFields.getFields(state),
        // @ts-expect-error TS2339
        total: fromSearch.getTotal(state),
        // @ts-expect-error TS2339
        searchQuery: fromSearch.getQuery(state),
        sortBy,
        sortDir,
        // @ts-expect-error TS2339
        datasetSearchTerm: fromDataset.getFilter(state),
        // @ts-expect-error TS2339
        datasetFacetsValues: fromDataset.getFacetsValues(state),
        // @ts-expect-error TS2339
        datasetAppliedFacets: fromDataset.getAppliedFacets(state),
        // @ts-expect-error TS2339
        datasetInvertedFacets: fromDataset.getInvertedFacets(state),
        // @ts-expect-error TS2339
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
