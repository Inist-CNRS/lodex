import { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import compose from 'recompose/compose';
import { useTranslate } from '@lodex/frontend-common/i18n/I18NContext';
import classnames from 'classnames';
import { CircularProgress, Button } from '@mui/material';

import {
    facetActions,
    search as searchAction,
    sort as sortAction,
    loadMore as loadMoreAction,
} from './reducer';
import { preLoadPublication as preLoadPublicationAction } from '@lodex/frontend-common/fields/reducer';
import { fromFields } from '@lodex/frontend-common/sharedSelectors';
import { fromSearch, fromDataset } from '../selectors';
import AdminOnlyAlert from '@lodex/frontend-common/components/AdminOnlyAlert';
import stylesToClassname from '@lodex/frontend-common/utils/stylesToClassName';
import AppliedFacetList from './AppliedSearchFacetList';
import FacetList from '../facet/FacetList';
import SearchResultList from './SearchResultList';
import SearchResultSort from './SearchResultSort';
import SearchSearchBar from './SearchSearchBar';
import SearchResultHeader from './SearchResultHeader';
import type { Field } from '@lodex/frontend-common/fields/types';

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

type SearchProps = {
    className?: string;
    search(...args: unknown[]): unknown;
    searchQuery?: string;
    sort(...args: unknown[]): unknown;
    sortBy: string;
    sortDir: 'ASC' | 'DESC';
    preLoadPublication(...args: unknown[]): unknown;
    loading: boolean;
    results: unknown[];
    fieldNames: {
        uri?: string;
        title?: string;
        description?: string;
    };
    fields: Field[];
    loadMore(...args: unknown[]): unknown;
    total: number;
    closeDrawer(...args: unknown[]): unknown;
    withFacets: boolean;
    withDataset: boolean;
    setFacets(...args: unknown[]): unknown;
    datasetSearchTerm?: string;
    datasetFacetsValues?: object;
    datasetAppliedFacets?: Record<string, string | number | boolean[]>;
    datasetInvertedFacets?: Record<string, string | number | boolean[]>;
    datasetOpenedFacets?: Record<string, boolean>;
};

const Search = ({
    className,
    search,
    searchQuery,
    sort,
    sortBy,
    sortDir,
    preLoadPublication,
    loading,
    results,
    fieldNames,
    fields,
    loadMore,
    total,
    closeDrawer,
    withFacets,
    withDataset,
    setFacets,
    datasetSearchTerm,
    datasetFacetsValues,
    datasetAppliedFacets,
    datasetInvertedFacets,
    datasetOpenedFacets,
}: SearchProps) => {
    const [opening, setOpening] = useState(true);
    const [showFacets, setShowFacets] = useState(false);

    const { translate } = useTranslate();

    useEffect(() => {
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

        const timer = setTimeout(() => {
            setOpening(false);
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // Empty dependency array for componentDidMount behavior

    const handleToggleFacets = () => {
        setShowFacets(!showFacets);
    };

    // @ts-expect-error TS7031
    const handleSort = ({ sortBy }) => {
        sort({ sortBy });
    };

    const renderNoResults = () => {
        return (
            // @ts-expect-error TS2339
            <div className={styles.noResult}>
                <div>
                    <strong>{translate('no_result')}</strong>
                </div>
                <div>{translate('no_result_details')}</div>
            </div>
        );
    };

    const renderNoOverviewField = () => {
        return (
            <AdminOnlyAlert>
                {translate('no_overview_field_error')}
            </AdminOnlyAlert>
        );
    };

    const renderLoadMore = () => {
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
                        {translate('loading')}
                    </>
                ) : (
                    <Button variant="text" fullWidth onClick={loadMore}>
                        {translate('search_load_more')} ({results.length} /{' '}
                        {total})
                    </Button>
                )}
            </div>
        );
    };

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
                    onToggleFacets={handleToggleFacets}
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
                    {noOverviewField && renderNoOverviewField()}
                    {noResults && renderNoResults()}
                    {(everythingIsOk || loading) && (
                        <>
                            <SearchResultHeader
                                displayStats={everythingIsOk || noResults}
                                sortComponent={
                                    <SearchResultSort
                                        fields={fields}
                                        fieldNames={fieldNames}
                                        sort={handleSort}
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
                    {canLoadMore && renderLoadMore()}
                </div>
            </div>
        </div>
    );
};

// @ts-expect-error TS7006
const mapStateToProps = (state) => {
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

export default compose<
    SearchProps,
    Omit<
        SearchProps,
        | 'search'
        | 'sort'
        | 'preLoadPublication'
        | 'loadMore'
        | 'setFacets'
        | 'loading'
        | 'results'
        | 'fieldNames'
        | 'fields'
        | 'total'
        | 'searchQuery'
        | 'sortBy'
        | 'sortDir'
        | 'datasetSearchTerm'
        | 'datasetFacetsValues'
        | 'datasetAppliedFacets'
        | 'datasetInvertedFacets'
        | 'datasetOpenedFacets'
    >
>(connect(mapStateToProps, mapDispatchToProps))(Search);
