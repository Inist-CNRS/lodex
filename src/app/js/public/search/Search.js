import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import translate from 'redux-polyglot/translate';
import classnames from 'classnames';
import debounce from 'lodash.debounce';
import CircularProgress from 'material-ui/CircularProgress';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
import theme from '../../theme';
import AdminOnlyAlert from '../../lib/components/AdminOnlyAlert';
import AppliedFacetList from './AppliedSearchFacetList';
import Facets from './Facets';
import SearchResultList from './SearchResultList';
import SearchResultSort from './SearchResultSort';
import stylesToClassname from '../../lib/stylesToClassName';
import ExportButton from '../ExportButton';
import SearchStats from './SearchStats';
import SearchBar from '../../lib/components/SearchBar';

const styles = stylesToClassname(
    {
        container: {
            margin: '0 auto',
        },
        header: {
            display: 'flex',
            flexDirection: 'column',
            padding: '1rem',
        },
        searchBarContainer: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
        },
        searchField: {
            flexGrow: 3,
        },
        details: {
            display: 'flex',
        },
        advanced: {
            display: 'flex',
            flex: '0 0 auto',
            flexDirection: 'column',
        },
        advancedTopBar: {
            display: 'flex',
        },
        searchMessage: {
            flex: '1 0 0',
            color: 'rgb(95, 99, 104)',
        },
        toggleFacets: {
            '@media (min-width: 992px)': {
                display: 'none !important',
            },
        },
        iconFacets: {
            color: theme.green.primary,
        },
        appliedFacets: {
            flex: '0 0 auto',
        },
        searchContent: {
            '@media (min-width: 992px)': {
                display: 'flex',
            },
        },
        facets: {
            opacity: '0',
            maxHeight: '0px',
            transition: 'max-height 300ms ease-in-out, opacity 600ms ease',
            '@media (min-width: 992px)': {
                opacity: '1',
                maxHeight: '1000px',
                minWidth: '300px',
                flex: 1,
            },
        },
        facetsOpening: {
            opacity: '1',
            maxHeight: '1000px',
        },
        searchResults: {
            padding: '1rem 0',
            opacity: '1',
            transition: 'opacity 300ms ease-in-out',
            '@media (min-width: 992px)': {
                minWidth: '600px',
                flex: 3,
            },
        },
        searchResultsOpening: {
            opacity: '0',
        },
        searchResultsEmpty: {
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
        icon: {
            marginRight: 8,
            marginTop: 8,
        },
        searchIcon: {
            color: theme.black.secondary,
        },
        toggleIcon: {
            color: theme.green.primary,
        },
        clearIcon: {
            color: theme.orange.primary,
        },
    },
    'search',
);

class Search extends Component {
    state = {
        bufferQuery: null,
        opening: true,
        showFacets: false,
    };

    constructor(props) {
        super(props);
        this.textInput = React.createRef();
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
            this.textInput.current.input.focus();
        }, 300);
    }

    debouncedSearch = debounce(params => {
        this.props.search(params);
    }, 500);

    handleTextFieldChange = (_, query) => {
        this.debouncedSearch({ query });
        this.setState({ bufferQuery: query });
    };

    handleToggleFacets = () => {
        const { showFacets } = this.state;
        this.setState({ showFacets: !showFacets });
    };

    handleSort = ({ sortBy }) => {
        const { sort } = this.props;
        sort({ sortBy });
    };

    handleClearFilter = () => {
        this.handleTextFieldChange(null, '');
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
                            size={20}
                            className={styles.loading}
                        />{' '}
                        {polyglot.t('loading')}
                    </>
                ) : (
                    <FlatButton fullWidth onClick={loadMore}>
                        {polyglot.t('search_load_more')} ({results.length} /{' '}
                        {total})
                    </FlatButton>
                )}
            </div>
        );
    };

    render() {
        const { bufferQuery, opening, showFacets } = this.state;
        const {
            searchQuery,
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
            <div className={classnames('search', styles.container)}>
                <div className={classnames('search-header', styles.header)}>
                    <SearchBar
                        value={
                            (bufferQuery !== null
                                ? bufferQuery
                                : searchQuery) || ''
                        }
                        onChange={this.handleTextFieldChange}
                        onClear={this.handleClearFilter}
                        actions={
                            <>
                                {withFacets && (
                                    <IconButton
                                        className={classnames(
                                            'search-facets-toggle',
                                            styles.toggleFacets,
                                        )}
                                        onClick={this.handleToggleFacets}
                                    >
                                        <FontAwesomeIcon
                                            className={styles.toggleIcon}
                                            icon={faFilter}
                                            height={20}
                                        />
                                    </IconButton>
                                )}
                                <ExportButton />
                            </>
                        }
                    />
                    <div
                        className={classnames(
                            'search-advanced',
                            styles.advanced,
                        )}
                    >
                        <div className={styles.advancedTopBar}>
                            {(everythingIsOk || noResults) && <SearchStats />}
                        </div>
                    </div>
                </div>
                {withFacets && (
                    <AppliedFacetList className={styles.appliedFacets} />
                )}
                <div
                    className={classnames(
                        'search-content',
                        styles.searchContent,
                    )}
                >
                    {withFacets && (
                        <Facets
                            className={classnames(
                                'search-facets',
                                styles.facets,
                                {
                                    [styles.facetsOpening]: showFacets,
                                },
                            )}
                        />
                    )}

                    <div
                        className={classnames(
                            'search-results',
                            styles.searchResults,
                            {
                                [styles.searchResultsOpening]: opening,
                            },
                        )}
                    >
                        {noOverviewField && this.renderNoOverviewField()}
                        {noResults && this.renderNoResults()}
                        {(everythingIsOk || loading) && (
                            <>
                                <SearchResultSort
                                    fields={fields}
                                    fieldNames={fieldNames}
                                    sort={this.handleSort}
                                    sortBy={sortBy}
                                    sortDir={sortDir}
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
    datasetInvertedFacets: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.bool,
        ]),
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
